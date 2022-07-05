package com.gsb.goodnews.command.paymentIntention;

import com.gsb.goodnews.domain.PaymentIntention;
import com.gsb.goodnews.dto.PaymentIntentionDto;
import com.gsb.goodnews.repository.CustomerRepository;
import com.gsb.goodnews.validations.RequiredValidator;
import com.gsb.goodnews.validations.ValidationError;
import com.gsb.goodnews.validations.Validator;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PaymentIntentionValidator extends Validator<PaymentIntention, PaymentIntentionDto> {

    private final CustomerRepository customerRepository;

    @Override
    public void validateCreate(@NonNull PaymentIntentionDto dto) {
        List<ValidationError> errors = new ArrayList<>();

        validateRequired(
                dto.getTotal(),
                dto.getReceiverDocument(),
                dto.getReceiverName(),
                dto.getCustomerId(),
                errors);

        customerExists(dto.getCustomerId(), errors);

        super.validate(errors);
    }

    private void validateRequired(BigDecimal total, String receiverDocument, String receiverName, long customerId, List<ValidationError> errors) {
        RequiredValidator.validate(errors, "total", total);
        RequiredValidator.validate(errors, "receiverDocument", receiverDocument);
        RequiredValidator.validate(errors, "receiverName", receiverName);
        RequiredValidator.validate(errors, "customerId", customerId);
    }

    private void customerExists(long customerId, List<ValidationError> errors) {
        if (customerId != 0 && !customerRepository.existsById(customerId)) {
            errors.add(super.getError("customerId", "Customer no encontrado"));
        }
    }
}
