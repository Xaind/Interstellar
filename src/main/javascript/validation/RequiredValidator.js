/*
 * Interstellar Javascript Framework
 * https://github.com/Xaind/interstellar
 * Copyright 2017, Xaind; Licensed MIT
 */

/**
 * A validator that checks if the input element has a value.
 * 
 * @module Interstellar.RequiredValidator
 */
Interstellar.RequiredValidator = Interstellar.validator({
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
			this.result(Interstellar.ERROR, this.errorMessage);
		} else {
			this.result(Interstellar.VALID);
		}
	}
});