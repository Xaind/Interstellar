/*
 * Element Javascript Framework
 * https://github.com/xaind/element
 * Copyright 2017, Xaind; Licensed Apache 2.0
 */
/**
 * A validator that checks if the input element has a value.
 * 
 * @module Element.RequiredValidator
 */
Element.RequiredValidator = Element.validator({
	/**
	 * The events for binding this validator.
	 */
	events: "focusout",
	
	/**
	 * The error message to display when invalid.
	 */
	errorMessage: "This field is required.",
	
	/**
	 * The template method implementation for this validator. Checks that an
	 * element is not null, undefined or falsey.
	 */
	doValidation: function() {
		if (!this.element.value()) {
			this.result(Element.ERROR, this.errorMessage);
		} else {
			this.result(Element.VALID);
		}
	}
});