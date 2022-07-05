package com.gsb.goodnews.command.providerAccount.validator;

import com.gsb.goodnews.validations.RequiredValidator;
import com.gsb.goodnews.validations.ValidationError;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProviderAccountValidatorHelper {

    public void validateRequired(String accountNumber, String bank, String type, List<ValidationError> errors) {
        RequiredValidator.validate(errors, "accountNumber", accountNumber);
        RequiredValidator.validate(errors, "bank", bank);
        RequiredValidator.validate(errors, "type", type);
    }
}
