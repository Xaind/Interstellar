/*
 * Element Javascript Framework
 * https://github.com/xaind/element
 * Copyright 2017, Xaind; Licensed Apache 2.0
 */
 
/**
 * The base validation object. Validators must implement the doValidation() method and
 * can optionally implement pre- and post-validation handlers. The validation can
 * be cancelled by returning true from a preValidationHandler.
 * 
 * The doValidation() method should set the status and can also set a message.
 * 
 * This object must be extended to include an 'element' property.
 * 
 * @module Element.Validator
 */
Element.Validator = {
	/**
	 * Base validation function the contains 3 template methods. This is the function called
	 * by external objects when validating an element.
	 *
	 * @return True if the validation is valid, false otherwise.
	 */
	validate: function() {
		var cancelValidation = false;
		
		if (this.preValidationHandler) {
			cancelValidation = this.preValidationHandler();
			if (cancelValidation) { 
				this.status = Element.CANCELLED;
			}
		}
		
		if (!cancelValidation) {
			this.doValidation();
			if (this.postValidationHandler) {
				this.postValidationHandler();
			}
			this.validationRenderer.updateView();
		}
		
		return Element.VALID === this.status;
	},
	
	/**
	 * Returns the validation result object.
	 *
	 * @return The validation result object.
	 */
	result: function(status, message) {
		this.status = status;
		this.message = message;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return True if valid, false otherwise.
	 */
	isValid: function() {
		return this.status === Element.VALID;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return True if invalid, false otherwise.
	 */
	isError: function() {
		return this.status === Element.ERROR;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return True if in warning status, false otherwise.
	 */
	isWarning: function() {
		return this.status === Element.WARNING;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return True if cancelled, false otherwise.
	 */
	isCancelled: function() {
		return this.status === Element.CANCELLED;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return True if currently validating, false otherwise.
	 */
	isValidating: function() {
		return this.status === Element.VALIDATING;
	}
};
