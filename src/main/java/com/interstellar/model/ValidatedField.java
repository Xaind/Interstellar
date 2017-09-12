/*
 * interstellar.js
 * https://github.com/xaind/interstellar
 * Copyright 2017, Xaind; Licensed Apache 2.0
 */
package com.interstellar.model;

import org.apache.commons.lang3.builder.ToStringBuilder;

/**
 * The validation state for a field.
 */
public class ValidatedField {

    private String fieldName;
    private ValidationStatus status;
    private String mssage;

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public ValidationStatus getStatus() {
        return status;
    }

    public void setStatus(ValidationStatus status) {
        this.status = status;
    }

    public String getMssage() {
        return mssage;
    }

    public void setMssage(String mssage) {
        this.mssage = mssage;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
