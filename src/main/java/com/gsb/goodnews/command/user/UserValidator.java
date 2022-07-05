package com.gsb.goodnews.command.user;

import com.gsb.goodnews.domain.User;
import com.gsb.goodnews.dto.UserDto;
import com.gsb.goodnews.exception.ValidationException;
import com.gsb.goodnews.repository.UserRepository;
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
public class UserValidator extends Validator<User, UserDto> {

    private final UserRepository userRepository;

    @Override
    public void validateCreate(@NonNull UserDto userDto) throws ValidationException {
        List<ValidationError> errors = new ArrayList<>();

        if (userDto.getId() != 0) {
            errors.add(super.getError("userId", "UserId debe ser 0"));
        }

        RequiredValidator.validate(errors, "username", userDto.getUsername());
        RequiredValidator.validate(errors, "password", userDto.getPassword());
        RequiredValidator.validate(errors, "email", userDto.getEmail());
        RequiredValidator.validate(errors, "roles", userDto.getRoles());

        if (userRepository.existsByUsername(userDto.getUsername())) {
            errors.add(super.getError("username", "El usuario ya se encuentra registrado"));
        }

        super.validate(errors);
    }
}
