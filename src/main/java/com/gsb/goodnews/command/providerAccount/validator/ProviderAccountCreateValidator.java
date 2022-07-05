package com.gsb.goodnews.command.providerAccount.validator;

import com.gsb.goodnews.domain.ProviderAccount;
import com.gsb.goodnews.dto.ProviderAccountsDto;
import com.gsb.goodnews.exception.ValidationException;
import com.gsb.goodnews.repository.ProviderRepository;
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
public class ProviderAccountCreateValidator extends Validator<ProviderAccount, ProviderAccountsDto> {

    private final ProviderRepository providerRepository;

    @Override
    public void validateCreate(@NonNull ProviderAccountsDto dto) throws ValidationException {
        List<ValidationError> errors = new ArrayList<>();

        RequiredValidator.validate(errors, "providerId", dto.getProviderId());
        providerExists(dto.getProviderId(), errors);

        for (int i = 0; i < dto.getAccounts().size(); i++) {
            RequiredValidator.validate(errors, "[" + i + "]." + "accountNumber", dto.getAccounts().get(i).getAccountNumber());
            RequiredValidator.validate(errors, "[" + i + "]." + "bank", dto.getAccounts().get(i).getBank());
            RequiredValidator.validate(errors, "[" + i + "]." + "type", dto.getAccounts().get(i).getType());
            RequiredValidator.validate(errors, "[" + i + "]." + "cbu", dto.getAccounts().get(i).getCbu());
            RequiredValidator.validate(errors, "[" + i + "]." + "fee", dto.getAccounts().get(i).getFee());
            RequiredValidator.validate(errors, "[" + i + "]." + "quota", dto.getAccounts().get(i).getQuota());
        }

        super.validate(errors);
    }

    private void providerExists(Long providerId, List<ValidationError> errors) {
        if (providerId != null
                && providerId != 0
                && !providerRepository.existsById(providerId)) {
            errors.add(new ValidationError("providerId", "Proveedor no encontrado"));
        }
    }
}
