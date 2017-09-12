/*
 * interstellar.js
 * https://github.com/xaind/interstellar
 * Copyright 2017, Xaind; Licensed Apache 2.0
 */
package com.interstellar.model;

/**
 * Enumeration of validation statuses.
 */
public enum ValidationStatus {

    VALID("valid"),
    ERROR("error"),
    WARNING("warning");
    
    private String value;
    
    private ValidationStatus(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
}
