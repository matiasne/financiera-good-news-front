package com.gsb.goodnews.command.transaction.payment;

import com.gsb.goodnews.domain.PaymentIntention;
import com.gsb.goodnews.domain.transaction.Payment;
import com.gsb.goodnews.dto.PaymentDto;
import com.gsb.goodnews.repository.CustomerRepository;
import com.gsb.goodnews.repository.PaymentIntentionRepository;
import com.gsb.goodnews.validations.RequiredValidator;
import com.gsb.goodnews.validations.ValidationError;
import com.gsb.goodnews.validations.Validator;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static com.gsb.goodnews.command.transaction.TransactionValidationHelper.validateTotal;

@Component
@RequiredArgsConstructor
public class PaymentValidator extends Validator<Payment, PaymentDto> {

    private final CustomerRepository customerRepository;
    private final PaymentIntentionRepository paymentIntentionRepository;

    @Override
    public void validateCreate(@NonNull PaymentDto dto) {
        List<ValidationError> errors = new ArrayList<>();

        validateRequired(
                dto.getTotal(),
                dto.getCustomerId(),
                errors);

        customerExists(dto.getCustomerId(), errors);
        validatePaymentIntention(dto.getPaymentIntentionId(), dto.getTotal(), errors);

        validateTotal(dto.getTotal(), errors);

        super.validate(errors);
    }

    private void validateRequired(BigDecimal total, long customerId, List<ValidationError> errors) {
        RequiredValidator.validate(errors, "total", total);
        RequiredValidator.validate(errors, "customerId", customerId);
    }

    private void validatePaymentIntention(Long paymentIntentionId, BigDecimal total, List<ValidationError> errors) {
        if (paymentIntentionId != null && paymentIntentionId != 0) {
            PaymentIntention paymentIntention = paymentIntentionRepository.findById(paymentIntentionId).orElse(null);
            if (paymentIntention == null) {
                errors.add(super.getError("paymentIntentionId", "Envio no encontrado"));
            } else if (paymentIntention.isPayed()) {
                errors.add(super.getError("paymentIntentionId", "El envio ya se encuentra pago"));
            } else if (paymentIntention.getTotal().compareTo(total) != 0) {
                errors.add(super.getError("total", "El el total es distinto al total del envio"));
            }
        }
    }

    private void customerExists(long customerId, List<ValidationError> errors) {
        if (customerId != 0 && !customerRepository.existsById(customerId)) {
            errors.add(super.getError("customerId", "Customer no encontrado"));
        }
    }
}
