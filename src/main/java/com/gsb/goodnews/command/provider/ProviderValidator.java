package com.gsb.goodnews.command.provider;

import com.gsb.goodnews.domain.Provider;
import com.gsb.goodnews.dto.person.ProviderDto;
import com.gsb.goodnews.exception.ValidationException;
import com.gsb.goodnews.repository.ProviderRepository;
import com.gsb.goodnews.validations.RequiredValidator;
import com.gsb.goodnews.validations.ValidationError;
import com.gsb.goodnews.validations.Validator;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProviderValidator extends Validator<Provider, ProviderDto> {

    private final ProviderRepository providerRepository;

    @Override
    public void validateCreate(@NonNull ProviderDto dto) throws ValidationException {
        List<ValidationError> errors = new ArrayList<>();

        validateRequired(dto.getName(), dto.getEmail(), errors);
        validateName(dto.getName(), errors);
        validateEmail(dto.getEmail(), errors);

        super.validate(errors);
    }

    @Override
    public void validateUpdate(@NonNull ProviderDto providerDto, @NonNull Provider provider) throws ValidationException {
        List<ValidationError> errors = new ArrayList<>();

        validateRequired(provider.getName(), provider.getEmail(), errors);

        if (!provider.getName().equalsIgnoreCase(providerDto.getName())) {
            validateName(providerDto.getName(), errors);
        }

        if (!provider.getEmail().equalsIgnoreCase(providerDto.getEmail())) {
            validateEmail(providerDto.getEmail(), errors);
        }

        super.validate(errors);
    }

    private void validateName(String name, List<ValidationError> errors) {
        if (!StringUtils.isBlank(name) && providerRepository.existsByName(name)) {
            errors.add(super.getError("name", "El nombre ya se encuentra registrado"));
        }
    }

    private void validateEmail(String email, List<ValidationError> errors) {
        if (!StringUtils.isBlank(email) && providerRepository.existsByEmail(email)) {
            errors.add(super.getError("email", "El email ya se encuentra registrado"));
        }
    }

    private void validateRequired(String name, String email, List<ValidationError> errors) {
        RequiredValidator.validate(errors, "name", name);
        RequiredValidator.validate(errors, "email", email);
    }

}
