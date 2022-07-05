package com.gsb.goodnews.command.paymentIntention;

import com.gsb.goodnews.domain.PaymentIntention;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.exception.ValidationException;
import com.gsb.goodnews.repository.PaymentIntentionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DeletePaymentIntentionCommand {

    private final PaymentIntentionRepository paymentIntentionRepository;

    public void delete(long id) {
        PaymentIntention paymentIntention = paymentIntentionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment intention not found"));

        if (!paymentIntention.getPayments().isEmpty()) {
            throw new ValidationException("id", "Payment Intention with payment cannot be removed");
        }

        paymentIntentionRepository.delete(paymentIntention);
    }
}
