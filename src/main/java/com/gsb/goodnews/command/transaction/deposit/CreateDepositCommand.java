package com.gsb.goodnews.command.transaction.deposit;

import com.gsb.goodnews.command.balance.UpdateCompanyBalanceCommand;
import com.gsb.goodnews.command.movement.CreateMovementCommand;
import com.gsb.goodnews.domain.*;
import com.gsb.goodnews.domain.transaction.Deposit;
import com.gsb.goodnews.dto.DepositDto;
import com.gsb.goodnews.mapper.DepositMapper;
import com.gsb.goodnews.queryobject.querydsl.JPAQueryFactory;
import com.gsb.goodnews.repository.CustomerRepository;
import com.gsb.goodnews.repository.DepositRepository;
import com.gsb.goodnews.repository.ProviderAccountRepository;
import com.gsb.goodnews.repository.ProviderRepository;
import com.querydsl.core.BooleanBuilder;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@AllArgsConstructor
public class CreateDepositCommand {

    private final DepositMapper depositMapper;
    private final DepositValidator depositValidator;
    private final DepositRepository depositRepository;
    private final ProviderAccountRepository providerAccountRepository;
    private final ProviderRepository providerRepository;
    private final CustomerRepository customerRepository;
    private final CreateMovementCommand createMovementCommand;
    private final JPAQueryFactory jpaQueryFactory;
    private final UpdateCompanyBalanceCommand updateCompanyBalanceCommand;

    public Deposit create(DepositDto dto) {

        depositValidator.validateCreate(dto);

        Customer customer = customerRepository.getById(dto.getCustomerId());
        ProviderAccount providerAccount = providerAccountRepository.getById(dto.getProviderAccountId());
        Provider provider = providerRepository.getById(providerAccount.getProvider().getId());

        Deposit deposit = depositMapper.map(dto);
        deposit.setStatus(Deposit.Status.INGRESADO.name());
        deposit.setProviderAccountFee(providerAccount.getFee());
        deposit.setCustomerFee(getCustomerFee(customer, providerAccount.getId()));
        deposit = depositRepository.save(deposit);

        updateProviderAccountQuota(providerAccount, deposit.getTotal(), deposit.getProviderAccountFee());

        BigDecimal customerTotal = updateCustomerBalance(customer, deposit);
        BigDecimal providerTotal = updateProviderBalance(provider, deposit);

        createMovements(dto, provider, customer, deposit);

        updateCompanyBalanceCommand.add(customerTotal, Balance.Type.CUSTOMER);
        updateCompanyBalanceCommand.add(providerTotal, Balance.Type.PROVIDER);

        return deposit;
    }

    private void createMovements(DepositDto dto, Provider provider, Customer customer, Deposit deposit) {
        String concept = "Depósito ID-" + deposit.getInternalId() + " ";
        createMovementCommand.create(
                customer,
                deposit,
                deposit.getProviderAccount(),
                deposit.getCustomerFee(),
                deposit.getCustomerFee(),
                concept,
                dto.getNotes());
        createMovementCommand.create(
                provider,
                deposit,
                deposit.getProviderAccount(),
                deposit.getProviderAccountFee(),
                deposit.getCustomerFee(),
                concept,
                dto.getNotes());
    }

    private BigDecimal updateCustomerBalance(Customer customer, Deposit deposit) {
        BigDecimal customerTotal = TotalHelper.getTotalForCustomer(deposit.getTotal(), deposit.getCustomerFee());
        customer.setPrevBalance(customer.getBalance());
        customer.setBalance(customer.getBalance().add(customerTotal));
        customerRepository.save(customer);
        return customerTotal;
    }

    private BigDecimal updateProviderBalance(Provider provider, Deposit deposit) {
        BigDecimal providerTotal = TotalHelper.getTotalForProvider(deposit.getTotal(), deposit.getProviderAccountFee());
        provider.setPrevBalance(provider.getBalance());
        provider.setBalance(provider.getBalance().add(providerTotal));
        providerRepository.save(provider);
        return providerTotal;
    }

    private void updateProviderAccountQuota(ProviderAccount providerAccount, BigDecimal total, BigDecimal providerAccountFee) {
        providerAccount.setQuota(providerAccount.getQuota()
                .subtract(TotalHelper.getTotalForProvider(total, providerAccountFee)));
        providerAccountRepository.save(providerAccount);
    }

    private BigDecimal getCustomerFee(Customer customer, long providerAccountId) {
        QCustomerCommission qCustomerCommission = QCustomerCommission.customerCommission;
        return jpaQueryFactory.get().select(qCustomerCommission.fee).from(qCustomerCommission)
                .where(new BooleanBuilder()
                        .and(qCustomerCommission.active.isTrue())
                        .and(qCustomerCommission.providerAccount.id.eq(providerAccountId))
                        .and(qCustomerCommission.customer.id.eq(customer.getId())))
                .fetchOne();
    }
}
