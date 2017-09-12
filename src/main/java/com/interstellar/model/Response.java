/*
 * interstellar.js
 * https://github.com/xaind/interstellar
 * Copyright 2017, Xaind; Licensed Apache 2.0
 */
package com.interstellar.model;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Creates a response for RESTful validation requests.
 */
public class Response {

    private Response() {
    }
    
    public static ResponseEntity<String> success(Object model, String message) {
        return createResponse(model, HttpStatus.OK);
    }
    
    public static ResponseEntity<String> warning(Object model, String message) {
        return createResponse(model, HttpStatus.OK);
    }
    
    public static ResponseEntity<String> error(Object model, String message) {
        return createResponse(model, HttpStatus.BAD_REQUEST);
    }
    
    protected static ResponseEntity<String> createResponse(Object model, HttpStatus httpStatus) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String value = objectMapper.writeValueAsString(model);
            return new ResponseEntity<String>(value, httpStatus);
        } catch (JsonProcessingException jpe) {
            throw new RuntimeException(jpe);
        }
    }

}
