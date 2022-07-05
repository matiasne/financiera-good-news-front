package com.gsb.goodnews.command.transaction.deposit;

import com.gsb.goodnews.domain.ProviderAccount;
import com.gsb.goodnews.domain.transaction.Deposit;
import com.gsb.goodnews.dto.DepositDto;
import com.gsb.goodnews.repository.CustomerRepository;
import com.gsb.goodnews.repository.DepositRepository;
import com.gsb.goodnews.repository.ProviderAccountRepository;
import com.gsb.goodnews.validations.RequiredValidator;
import com.gsb.goodnews.validations.ValidationError;
import com.gsb.goodnews.validations.Validator;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static com.gsb.goodnews.command.transaction.TransactionValidationHelper.validateTotal;

@Component
@RequiredArgsConstructor
public class DepositValidator extends Validator<Deposit, DepositDto> {

    private final DepositRepository depositRepository;
    private final CustomerRepository customerRepository;
    private final ProviderAccountRepository providerAccountRepository;

    @Override
    public void validateCreate(@NonNull DepositDto dto) {
        List<ValidationError> errors = new ArrayList<>();

        validateRequired(
                dto.getInternalId(),
                dto.getFile(),
                dto.getTotal(),
                dto.getProviderAccountId(),
                dto.getCustomerId(),
                errors);

        providerAccountExists(dto.getProviderAccountId(), errors);
        customerExists(dto.getCustomerId(), errors);
        depositExists(dto.getInternalId(), errors);
        validateTotal(dto.getTotal(), errors);

        super.validate(errors);
    }

    private void depositExists(String internalId, List<ValidationError> errors) {
        if (StringUtils.isNotBlank(internalId) && depositRepository.existsByInternalId(internalId)) {
            errors.add(super.getError("internalId", "Comprobante duplicado"));
        }
    }

    private void customerExists(long customerId, List<ValidationError> errors) {
        if (customerId != 0 && !customerRepository.existsById(customerId)) {
            errors.add(super.getError("customerId", "Customer no encontrado"));
        }
    }

    private void providerAccountExists(long providerAccountId, List<ValidationError> errors) {
        if (providerAccountId != 0) {
            ProviderAccount providerAccount = providerAccountRepository.findById(providerAccountId).orElse(null);
            if (providerAccount == null || !providerAccount.isActive()) {
                errors.add(super.getError("providerAccountId", "ProviderAccount no encontrado"));
            }
        }
    }

    private void validateRequired(String internalId, String file, BigDecimal total, long providerAccountId, long customerId, List<ValidationError> errors) {
        RequiredValidator.validate(errors, "internalId", internalId);
        RequiredValidator.validate(errors, "file", file);
        RequiredValidator.validate(errors, "total", total);
        RequiredValidator.validate(errors, "providerAccountId", providerAccountId);
        RequiredValidator.validate(errors, "customerId", customerId);
    }
}
