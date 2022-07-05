package com.gsb.goodnews.validations;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class ValidationError {
    private String field;
    private String message;
}
