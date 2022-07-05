package com.gsb.goodnews.command.transaction.payment;

import com.gsb.goodnews.command.balance.UpdateCompanyBalanceCommand;
import com.gsb.goodnews.command.movement.CreateMovementCommand;
import com.gsb.goodnews.domain.Balance;
import com.gsb.goodnews.domain.Customer;
import com.gsb.goodnews.domain.PaymentIntention;
import com.gsb.goodnews.domain.transaction.Payment;
import com.gsb.goodnews.dto.PaymentDto;
import com.gsb.goodnews.mapper.PaymentMapper;
import com.gsb.goodnews.repository.CustomerRepository;
import com.gsb.goodnews.repository.PaymentIntentionRepository;
import com.gsb.goodnews.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class CreatePaymentCommand {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final PaymentValidator paymentValidator;
    private final CustomerRepository customerRepository;
    private final CreateMovementCommand createMovementCommand;
    private final PaymentIntentionRepository paymentIntentionRepository;
    private final UpdateCompanyBalanceCommand updateCompanyBalanceCommand;

    public Payment create(PaymentDto dto) {
        paymentValidator.validateCreate(dto);

        Payment payment = paymentMapper.map(dto);
        if (dto.getPaymentIntentionId() != null) {
            PaymentIntention paymentIntention = paymentIntentionRepository.getById(dto.getPaymentIntentionId());
            markPaymentIntentionAsPayed(paymentIntention);
            payment.setTotal(paymentIntention.getTotal());
        }

        Customer customer = customerRepository.getById(dto.getCustomerId());
        updateCustomerBalance(customer, dto);
        createMovement(customer, payment, dto);

        payment = paymentRepository.save(payment);

        updateCompanyBalanceCommand.subtract(dto.getTotal(), Balance.Type.PRINCIPAL);
        updateCompanyBalanceCommand.subtract(dto.getTotal(), Balance.Type.CUSTOMER);

        return payment;
    }

    private void markPaymentIntentionAsPayed(PaymentIntention paymentIntention) {
        paymentIntention.setPayed(true);
        paymentIntentionRepository.save(paymentIntention);
    }

    private void updateCustomerBalance(Customer customer, PaymentDto dto) {
        customer.setPrevBalance(customer.getBalance());
        customer.setBalance(customer.getBalance().subtract(dto.getTotal()));
        customerRepository.save(customer);
    }

    private void createMovement(Customer customer, Payment payment, PaymentDto dto) {
        String concept;
        if (dto.getPaymentIntentionId() == null) {
            concept = "Retiro";
        } else {
            PaymentIntention paymentIntention = paymentIntentionRepository.getById(dto.getPaymentIntentionId());
            concept = String.format("Retiro de %s %s",
                    paymentIntention.getReceiverName(),
                    paymentIntention.getReceiverDocument());
        }

        createMovementCommand.create(
                customer,
                payment,
                null,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                concept,
                dto.getNotes());
    }
}
