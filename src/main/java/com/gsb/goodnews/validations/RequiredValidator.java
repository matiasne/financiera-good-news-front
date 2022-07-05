package com.gsb.goodnews.validations;

import org.apache.commons.lang3.StringUtils;

import java.math.BigDecimal;
import java.util.List;

/**
 * Validate if required value is not null, primitive default or empty
 */
public class RequiredValidator {

    public static final String ERROR_MESSAGE = "Requerido";

    private static void addError(List<ValidationError> validationErrors, String field) {
        validationErrors.add(ValidationError.builder()
                .field(field)
                .message(ERROR_MESSAGE)
                .build());
    }

    /**
     * @param validationErrors list to push the error if exists
     * @param field            name of property to validate
     * @param value            to validate
     */
    public static void validate(List<ValidationError> validationErrors, String field, String value) {
        if (StringUtils.isBlank(value)) {
            addError(validationErrors, field);
        }
    }

    public static void validate(List<ValidationError> validationErrors, String field, int value) {
        if (value == 0) {
            addError(validationErrors, field);
        }
    }

    public static void validate(List<ValidationError> validationErrors, String field, long value) {
        if (value == 0) {
            addError(validationErrors, field);
        }
    }

    public static void validate(List<ValidationError> validationErrors, String field, double value) {
        if (value == 0) {
            addError(validationErrors, field);
        }
    }

    public static void validate(List<ValidationError> validationErrors, String field, BigDecimal value) {
        if (value == null || BigDecimal.ZERO.compareTo(value) == 0) {
            addError(validationErrors, field);
        }
    }

    public static void validate(List<ValidationError> validationErrors, String field, List<?> values) {
        if (values == null || values.isEmpty()) {
            addError(validationErrors, field);
        }
    }

    public static void validate(List<ValidationError> validationErrors, String field, Object object) {
        if (object == null) {
            addError(validationErrors, field);
        }
    }
}
