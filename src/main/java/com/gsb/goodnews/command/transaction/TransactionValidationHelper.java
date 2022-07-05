package com.gsb.goodnews.command.transaction;

import com.gsb.goodnews.validations.ValidationError;

import java.math.BigDecimal;
import java.util.List;

public class TransactionValidationHelper {

    public static void validateTotal(BigDecimal total, List<ValidationError> errors) {
        if (total != null && total.compareTo(BigDecimal.ZERO) <= 0) {
            errors.add(new ValidationError("total", "El total debe ser mayor a 0"));
        }
    }
}
