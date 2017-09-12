/*
 * interstellar.js
 * https://github.com/xaind/interstellar
 * Copyright 2017, Xaind; Licensed Apache 2.0
 */
package com.interstellar.model;

import java.util.List;

import org.apache.commons.lang3.builder.ToStringBuilder;

/**
 * The view model combines a model object which is typically a POJO with
 * field validation info.
 */
public class ViewModel<T> {

    private T model;
    private List<ValidatedField> validatedFields;

    public ViewModel(T model) {
        this.model = model;
    }
    
    public T getModel() {
        return model;
    }

    public void setModel(T model) {
        this.model = model;
    }
    
    public List<ValidatedField> getValidatedFields() {
        return validatedFields;
    }

    public void setValidatedFields(List<ValidatedField> validatedFields) {
        this.validatedFields = validatedFields;
    }
    
    public void addValidatedField(ValidatedField validatedField) {
        getValidatedFields().add(validatedField);
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
