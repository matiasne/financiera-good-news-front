package com.gsb.goodnews.command.customerCommission.validator;

import com.gsb.goodnews.domain.CustomerCommission;
import com.gsb.goodnews.domain.ProviderAccount;
import com.gsb.goodnews.dto.CustomerCommissionsDto;
import com.gsb.goodnews.exception.ValidationException;
import com.gsb.goodnews.repository.CustomerRepository;
import com.gsb.goodnews.repository.ProviderAccountRepository;
import com.gsb.goodnews.validations.RequiredValidator;
import com.gsb.goodnews.validations.ValidationError;
import com.gsb.goodnews.validations.Validator;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CustomerCommissionCreateValidator extends Validator<CustomerCommission, CustomerCommissionsDto> {

    private final ProviderAccountRepository providerAccountRepository;
    private final CustomerRepository customerRepository;

    @Override
    public void validateCreate(@NonNull CustomerCommissionsDto dto) throws ValidationException {
        List<ValidationError> errors = new ArrayList<>();

        RequiredValidator.validate(errors, "customerId", dto.getCustomerId());
        customerExists(dto.getCustomerId(), errors);

        for (int i = 0; i < dto.getCommissions().size(); i++) {
            RequiredValidator.validate(errors, "[" + i + "]." + "providerAccountId", dto.getCommissions().get(i).getProviderAccountId());
            RequiredValidator.validate(errors, "[" + i + "]." + "fee", dto.getCommissions().get(i).getFee());

            providerAccountExists(errors, "[" + i + "]." + "providerAccountId", dto.getCommissions().get(i).getProviderAccountId());
        }


        super.validate(errors);
    }

    private void customerExists(Long customer, List<ValidationError> errors) {
        if (customer != null
                && customer != 0
                && !customerRepository.existsById(customer)) {
            errors.add(new ValidationError("customer", "Cliente no encontrad0"));
        }
    }

    private void providerAccountExists(List<ValidationError> errors, String field, Long providerAccountId) {
        if (providerAccountId != null && providerAccountId != 0) {
            ProviderAccount providerAccount = providerAccountRepository.findById(providerAccountId).orElse(null);
            if (providerAccount == null || !providerAccount.isActive()) {
                errors.add(new ValidationError(field, "Cuenta de Proveedor no encontrada"));
            }
        }
    }
}
