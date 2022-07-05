package com.gsb.goodnews.command.customer;

import com.gsb.goodnews.domain.Customer;
import com.gsb.goodnews.dto.person.CustomerDto;
import com.gsb.goodnews.repository.CustomerRepository;
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
public class CustomerValidator extends Validator<Customer, CustomerDto> {

    private final CustomerRepository customerRepository;

    @Override
    public void validateCreate(@NonNull CustomerDto dto) {
        List<ValidationError> errors = new ArrayList<>();

        validateRequired(dto.getName(), dto.getPhone(), dto.getEmail(), errors);
        validateEmail(dto.getEmail(), errors);

        super.validate(errors);
    }

    @Override
    public void validateUpdate(@NonNull CustomerDto customerDto, @NonNull Customer customer) {
        List<ValidationError> errors = new ArrayList<>();

        validateRequired(customerDto.getName(), customerDto.getPhone(), customerDto.getEmail(), errors);

        if (!customer.getEmail().equalsIgnoreCase(customerDto.getEmail())) {
            validateEmail(customerDto.getEmail(), errors);
        }

        super.validate(errors);
    }

    private void validateRequired(String name, String phone, String email, List<ValidationError> errors) {
        RequiredValidator.validate(errors, "name", name);
        RequiredValidator.validate(errors, "phone", phone);
        RequiredValidator.validate(errors, "email", email);
    }

    private void validateEmail(String email, List<ValidationError> errors) {
        if (!StringUtils.isBlank(email) && customerRepository.existsByEmail(email)) {
            errors.add(super.getError("email", "El email ya se encuentra registrado"));
        }
    }
}
