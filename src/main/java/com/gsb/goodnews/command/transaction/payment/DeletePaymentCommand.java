package com.gsb.goodnews.command.transaction.payment;

import com.gsb.goodnews.domain.transaction.Payment;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DeletePaymentCommand {

    private final PaymentRepository paymentRepository;

    public void delete(long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment not found"));

        paymentRepository.delete(payment);
    }
}
