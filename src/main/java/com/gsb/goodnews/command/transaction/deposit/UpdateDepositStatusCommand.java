package com.gsb.goodnews.command.transaction.deposit;

import com.gsb.goodnews.command.balance.UpdateCompanyBalanceCommand;
import com.gsb.goodnews.command.movement.CreateMovementCommand;
import com.gsb.goodnews.domain.Balance;
import com.gsb.goodnews.domain.Customer;
import com.gsb.goodnews.domain.Provider;
import com.gsb.goodnews.domain.ProviderAccount;
import com.gsb.goodnews.domain.transaction.Deposit;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.exception.ValidationException;
import com.gsb.goodnews.repository.CustomerRepository;
import com.gsb.goodnews.repository.DepositRepository;
import com.gsb.goodnews.repository.ProviderAccountRepository;
import com.gsb.goodnews.repository.ProviderRepository;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@AllArgsConstructor
public class UpdateDepositStatusCommand {

    private final DepositRepository depositRepository;
    private final ProviderRepository providerRepository;
    private final CustomerRepository customerRepository;
    private final CreateMovementCommand createMovementCommand;
    private final ProviderAccountRepository providerAccountRepository;
    private final UpdateCompanyBalanceCommand updateCompanyBalanceCommand;

    public Deposit update(long id, String status) {
        Deposit deposit = depositRepository.findById(id).orElseThrow(() -> new NotFoundException("Deposit not found"));

        Deposit.Status depositNewStatus = EnumUtils.getEnumIgnoreCase(Deposit.Status.class, status);
        if (depositNewStatus == null) {
            throw new ValidationException("status", "Status is invalid");
        }

        if (deposit.getStatus().equalsIgnoreCase(status)) {
            return deposit;
        }

        ProviderAccount providerAccount = providerAccountRepository.getById(deposit.getProviderAccount().getId());
        Provider provider = providerRepository.getById(providerAccount.getProvider().getId());
        Customer customer = customerRepository.getById(deposit.getCustomer().getId());
        BigDecimal customerTotal = TotalHelper.getTotalForCustomer(deposit.getTotal(), deposit.getCustomerFee());
        BigDecimal providerTotal = TotalHelper.getTotalForProvider(deposit.getTotal(), deposit.getProviderAccountFee());

        // SI SE ESTA CANCELANDO UN DEPOSITO
        if ((deposit.getStatus().equalsIgnoreCase(Deposit.Status.INGRESADO.name())
                || deposit.getStatus().equalsIgnoreCase(Deposit.Status.CONFIRMADO.name()))
                && (depositNewStatus.equals(Deposit.Status.RECHAZADO)
                || depositNewStatus.equals(Deposit.Status.ERROR_DE_CARGA)
                || depositNewStatus.equals(Deposit.Status.CUIT_INCORRECTO)
                || depositNewStatus.equals(Deposit.Status.PENDIENTE_DE_ACREDITACION))) {

            // SE REGISTRA SALDO PENDIENTE CUANDO PASA A UN ESTADO RECUPERABLE
            if (depositNewStatus.equals(Deposit.Status.CUIT_INCORRECTO)
                    || depositNewStatus.equals(Deposit.Status.PENDIENTE_DE_ACREDITACION)) {
                customer.setUnconfirmedBalance(customer.getUnconfirmedBalance().add(customerTotal));
                provider.setUnconfirmedBalance(provider.getUnconfirmedBalance().add(providerTotal));
            }

            customer.setPrevBalance(customer.getBalance());
            customer.setBalance(customer.getBalance().subtract(customerTotal));
            customerRepository.save(customer);
            updateCompanyBalanceCommand.subtract(customerTotal, Balance.Type.CUSTOMER);

            provider.setPrevBalance(provider.getBalance());
            provider.setBalance(provider.getBalance().subtract(providerTotal));
            providerRepository.save(provider);
            updateCompanyBalanceCommand.subtract(providerTotal, Balance.Type.PROVIDER);

            String concept = getConcept(deposit, depositNewStatus);
            createMovementCommand.create(
                    customer,
                    deposit,
                    deposit.getProviderAccount(),
                    deposit.getCustomerFee(),
                    deposit.getCustomerFee(),
                    concept,
                    StringUtils.EMPTY);
            createMovementCommand.create(
                    provider,
                    deposit,
                    deposit.getProviderAccount(),
                    deposit.getProviderAccountFee(),
                    deposit.getCustomerFee(),
                    concept,
                    StringUtils.EMPTY);

            // SI SE ESTA CONFIRMANDO UN DEPOSITO
        } else if ((deposit.getStatus().equalsIgnoreCase(Deposit.Status.RECHAZADO.name())
                || deposit.getStatus().equalsIgnoreCase(Deposit.Status.ERROR_DE_CARGA.name())
                || depositNewStatus.equals(Deposit.Status.CUIT_INCORRECTO)
                || depositNewStatus.equals(Deposit.Status.PENDIENTE_DE_ACREDITACION))
                && (depositNewStatus.equals(Deposit.Status.INGRESADO)
                || depositNewStatus.equals(Deposit.Status.CONFIRMADO))) {

            // SE QUITA SALDO PENDIENTE CUANDO SE CONFIRMA LUEGO DE UN ESTADO RECUPERABLE
            if (deposit.getStatus().equalsIgnoreCase(Deposit.Status.CUIT_INCORRECTO.name())
                    || deposit.getStatus().equalsIgnoreCase(Deposit.Status.PENDIENTE_DE_ACREDITACION.name())) {
                customer.setUnconfirmedBalance(customer.getUnconfirmedBalance().subtract(customerTotal));
                provider.setUnconfirmedBalance(provider.getUnconfirmedBalance().subtract(providerTotal));
            }

            customer.setPrevBalance(customer.getBalance());
            customer.setBalance(customer.getBalance().add(customerTotal));
            customerRepository.save(customer);
            updateCompanyBalanceCommand.add(customerTotal, Balance.Type.CUSTOMER);

            provider.setPrevBalance(provider.getBalance());
            provider.setBalance(provider.getBalance().add(providerTotal));
            providerRepository.save(provider);
            updateCompanyBalanceCommand.add(providerTotal, Balance.Type.PROVIDER);

            String concept = getConcept(deposit, depositNewStatus);
            createMovementCommand.create(
                    customer,
                    deposit,
                    deposit.getProviderAccount(),
                    deposit.getCustomerFee(),
                    deposit.getCustomerFee(),
                    concept,
                    StringUtils.EMPTY);
            createMovementCommand.create(
                    provider,
                    deposit,
                    deposit.getProviderAccount(),
                    deposit.getProviderAccountFee(),
                    deposit.getCustomerFee(),
                    concept,
                    StringUtils.EMPTY);
        }

        deposit.setStatus(depositNewStatus.name());
        return depositRepository.save(deposit);
    }

    private String getConcept(Deposit deposit, Deposit.Status depositStatus) {
        String concept;
        switch (depositStatus) {
            case INGRESADO:
                concept = "Depósito ingresado";
                break;
            case CONFIRMADO:
                concept = "Depósito confirmado";
                break;
            case RECHAZADO:
                concept = "Depósito rechazado";
                break;
            case ERROR_DE_CARGA:
                concept = "Depósito con error de carga";
                break;
            case CUIT_INCORRECTO:
                concept = "Depósito con CUIT incorrecto";
                break;
            case PENDIENTE_DE_ACREDITACION:
                concept = "Depósito pendiente de acreditación";
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + depositStatus);
        }
        concept += " ID-" + deposit.getInternalId();
        return concept;
    }
}
