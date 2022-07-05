package com.gsb.goodnews.exception;

import com.gsb.goodnews.validations.ValidationError;
import lombok.Getter;

import java.util.List;

@Getter
public class ValidationException extends RuntimeException {

    private final List<ValidationError> validationErrors;

    public ValidationException(List<ValidationError> validationErrors) {
        super();
        this.validationErrors = validationErrors;
    }

    public ValidationException(String field, String message) {
        super();
        this.validationErrors = List.of(new ValidationError(field, message));
    }
}
