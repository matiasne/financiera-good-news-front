package com.gsb.goodnews.validations;

import com.gsb.goodnews.exception.ValidationException;
import lombok.NonNull;
import org.apache.commons.lang3.NotImplementedException;

import java.util.List;

/**
 * Template class to validate CRUD operations
 *
 * @param <Entity> The Entity to persist
 * @param <DTO>    The DTO with the new data
 */
public abstract class Validator<Entity, DTO> {

    /**
     * Validate integrity of the dto
     *
     * @param dto The dto to validate
     * @throws ValidationException If integrity check fails
     */
    public void validateCreate(@NonNull DTO dto) throws ValidationException {
        throw new NotImplementedException("Method should be implemented on subclass");
    }

    /**
     * Validate requested new data from {@param DTO} using existing {@param Entity} for complex validations
     *
     * @param dto    DTO with new {@param entity} data
     * @param entity Expecting Entity before {@param dto} data was merged
     * @throws ValidationException If integrity check fails
     */
    public void validateUpdate(@NonNull DTO dto, @NonNull Entity entity) throws ValidationException {
        throw new NotImplementedException("Method should be implemented on subclass");
    }

    public void validateDelete(@NonNull Entity entity) throws ValidationException {
        throw new NotImplementedException("Method should be implemented on subclass");
    }

    protected void validate(List<ValidationError> validationErrors) throws ValidationException {
        if (!validationErrors.isEmpty()) {
            throw new ValidationException(validationErrors);
        }
    }

    protected ValidationError getError(String field, String message) {
        return ValidationError.builder()
                .field(field)
                .message(message)
                .build();
    }
}
