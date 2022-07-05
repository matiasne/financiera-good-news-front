package com.gsb.goodnews.controller.filter;

import com.gsb.goodnews.exception.ValidationException;
import com.gsb.goodnews.util.CustomSerializer;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.io.IOException;

@ControllerAdvice
@AllArgsConstructor
public class ValidationExceptionFilter extends ResponseEntityExceptionHandler {

    private final CustomSerializer customSerializer;

    @ExceptionHandler(value = {ValidationException.class})
    protected ResponseEntity<Object> handleConflict(RuntimeException runtimeException, WebRequest request) {
        ValidationException validationException = (ValidationException) runtimeException;

        String body;
        try {
            body = customSerializer.writeValueAsString(validationException.getValidationErrors());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");

        return handleExceptionInternal(
                runtimeException,
                body,
                headers,
                HttpStatus.BAD_REQUEST,
                request);
    }
}