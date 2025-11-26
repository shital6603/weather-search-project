package com.example.weather.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> onRuntime(RuntimeException ex) {
        return ResponseEntity.status(500).body(java.util.Map.of("error", ex.getMessage()));
    }
}
