package com.gsb.goodnews.command.transaction.providerCashDelivery;

import com.gsb.goodnews.domain.transaction.ProviderCashDelivery;
import com.gsb.goodnews.dto.ProviderCashDeliveryDto;
import com.gsb.goodnews.exception.ValidationException;
import com.gsb.goodnews.repository.ProviderRepository;
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
public class ProviderCashDeliveryValidator extends Validator<ProviderCashDelivery, ProviderCashDeliveryDto> {

    private final ProviderRepository providerRepository;

    @Override
    public void validateCreate(@NonNull ProviderCashDeliveryDto dto) throws ValidationException {
        List<ValidationError> errors = new ArrayList<>();

        validateRequired(dto.getProviderId(), dto.getTotal(), errors);
        validateProvider(dto.getProviderId(), errors);
        validateTotal(dto.getTotal(), errors);

        super.validate(errors);
    }

    private void validateProvider(long providerId, List<ValidationError> errors) {
        if (providerId != 0 && !providerRepository.existsById(providerId)) {
            errors.add(super.getError("providerId", "El proveedor no existe"));
        }
    }

    private void validateRequired(long providerId, BigDecimal total, List<ValidationError> errors) {
        RequiredValidator.validate(errors, "providerId", providerId);
        RequiredValidator.validate(errors, "total", total);
    }

}
