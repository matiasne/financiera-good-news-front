package com.gsb.goodnews.controller.filter;

import io.jsonwebtoken.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class JwtExceptionFilter extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = {ExpiredJwtException.class, UnsupportedJwtException.class, MalformedJwtException.class, SignatureException.class})
    protected ResponseEntity<Object> handleConflict(RuntimeException runtimeException, WebRequest request) {
        JwtException validationException = (JwtException) runtimeException;

        return handleExceptionInternal(
                runtimeException,
                validationException.getMessage(),
                new HttpHeaders(),
                HttpStatus.UNAUTHORIZED,
                request);
    }
}