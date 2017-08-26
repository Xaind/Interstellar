/*
 * interstellar.js
 * https://github.com/Xaind/interstellar
 * Copyright 2017, Xaind; Licensed MIT
 */

var Interstellar = {};

(function() {
"use strict";

/**
 * The top-level object which manages the page model. HTML fields are typically
 * add via calls to Interstellar.element(). Helper functions are provided for
 * validation and for getting and setting the model via JSON.
 * 
 * @class Interstellar
 */
$.extend(Interstellar, {
	elements: [],
	
	/**
	 * Validates all elements currently registered with Interstellar.
	 * 
	 * @return true if all elements are valid, false otherwise.
	 */
	validate: function() {
		var isValid = true;
		for (var i = 0; i < this.elements.length; i++) {
			if (this.elements[i].validator) {
				isValid = isValid & this.elements[i].validate();
			}
		}
		return isValid;
	},
	
	/**
	 * Sets or gets the current data model. If a data model is specified then Interstellar
	 * will attempt to match each field against the current array of elements and update the
	 * value and validation status accordingly.
	 * 
	 * @param data the data model to set.
	 * @return the data model.
	 */
	data: function(data) {
		if (data) {
			// Convert the incoming data into a model
			
			
		} else {
			// Output the current model as JSON
			var data = [];
			for (var i = 0, length = this.elements.length; i < length; i++) {
				var element = this.elements[i];
				if (!element.name) {
					continue;
				}
				
				data.push({
					name: element.name,
					value: element.value(),
					type: element.type,
					validationStatus: element.validator.status,
					validationMessage: element.validator.message
				});
			}
			
			return data;
		}
	},
	
	/**
	 * Creates a page element based on the specified configuration. If a data model is
	 * present then it will be checked for a matching name and set the element's value
	 * and validation status accordingly. 
	 * 
	 * @param config the element configuration.
	 */
	element: function(config) {
		var element = $.extend({}, Interstellar.Element, config);
		this.elements.push(element);
		
		if (element.listeners) {
			if (!(element.listeners instanceof Array)) {
				element.listeners = [element.listeners];
			}
			
			for (var i = 0, length = element.listeners.length; i < length; i++) {
				var listener = element.listeners[i];
				listener.element = element;
				element.registerListener(listener);
			}
		}

		if (element.validator) {
			element.validator.element = element;
			element.registerValidator(element.validator);
			
			// Set up the validation renderer
			if (element.validationRenderer) {
				element.validator.validationRenderer = element.validationRenderer;
				element.validationRenderer.validator = element.validator;
			} else {
				// If no renderer specified use the default
				element.validator.validationRenderer = $.extend({}, Interstellar.Bootstrap3Renderer);
				element.validator.validationRenderer.validator = element.validator;
			}
		}
		
		return element;
	},

	/**
	 * Creates a validator based on the specified config. If a baseValidator
	 * is specified then it will used as a basis.
	 * 
	 * @param config validation config.
	 * @param baseValidator the validator used for extension.
	 * @return a new validator.
	 */
	validator: function(config, baseValidator) {
		if (!baseValidator) {
			baseValidator = Interstellar.Validator;
		}
		return $.extend({}, baseValidator, config);
	},

	/**
	 * Validation statuses.
	 */
	VALID: "valid",
	ERROR: "error",
	WARNING: "warning",
	CANCELLED: "cancelled",
	VALIDATING: "validating"
});

/**
 * Page element definition. An element typically represents a HTML input element but can be used
 * any HTML element such as a button, link or even a div. An element is created by passing in a
 * configuration object to Interstellar.element(). 
 * 
 * @class Element
 */
Interstellar.Element = {		
	id: null,
	name: null,
	type: null,
	validator: null,
	listeners: [],
	
	/**
	 * Returns the jQuery object that represents this element.
	 *
	 * @return the associated jQuery object.
	 */
	el: function() {
		if (this.id) {
			return $("#" + this.id);
		} else {
			return $("#" + this.name);
		}
	},
	
	/**
	 * Binds a function to an event on the element. Typically used to bind onclick listeners and validation callbacks.
	 * This function is not intended to be accessed directly, it is called by the registerXXX() functions.
	 * 
	 * @param callback the callback function to execute.
	 * @param events an array of events to bind the callback to the element.
	 */
	bind: function(callback, events) {
		if (!(events instanceof Array)) {
			events = [events];
		}
		
		for (var j = 0, length = events.length; j < length; j++) {
			var event = events[j];
			if (event === "enterkey") {
				this.el().on("keypress", function(e) {
					if (e.which === 13) {
						callback();
					}
				});
			}  else {
				this.el().on(events[j], this, callback);
			}
		}
	},
	
	/**
	 * Sets or returns the value assigned to this element. If a value is specified then
	 * this acts as a setter otherwise it will return the currently assigned value.
	 *
	 * @param value the value to assign (should be undefined when getting the value).
	 * @return the current value assigned to this element.
	 */
	value: function(value) {
		if (typeof value === "undefined") {			
			return this.el().val();
		}		
		this.el().val(value);
	},
	
	/**
	 * Registers a generic listener with this element. The listener will contains an array of events that will
	 * be bound to this element as well as the callback function.
	 *
	 * @param listener the listener to bind.
	 */
	registerListener: function(listener) {
		this.listeners.push(listener);
		this.bind(function() {
			listener.callback();
		}, listener.events);
	},
	
	/**
	 * Registers a validator with this element. The validator will contain an array of events that will
	 * trigger the validation. It will also contain the validation callback function.
	 *
	 * @param validator the validator to bind.
	 */
	registerValidator: function(validator) {
		this.validator = validator;
		this.bind(function() {
			return validator.validate();
		}, validator.events);
	},
	
	/**
	 * Calls this element's validators. If you just need to check the current validation status
	 * then use one of the status check functions below.
	 *
	 * @return true if the element is valid, false otherwise.
	 */
	validate: function() {
		return this.validator.validate();
	},
	
	/**
	 * Checks the current validation status.
	 *
	 * @return true if the element is valid, false otherwise.
	 */
	isValid: function() {
		return this.validator.isSuccess();
	},
	
	/**
	 * Checks the current validation status.
	 *
	 * @return true if the element is invalid, false otherwise.
	 */
	isError: function() {
		return this.validator.isError();
	},	
	
	/**
	 * Checks the current validation status.
	 *
	 * @return true if the element is in warning status, false otherwise.
	 */
	isWarning: function() {
		return this.validator.isWarning();
	},		
	
	/**
	 * Checks the current validation status.
	 *
	 * @return true if the element's validation has been cancelled, false otherwise.
	 */
	isCancelled: function() {
		return this.validator.isCancelled();
	},		
	
	/**
	 * Checks the current validation status.
	 *
	 * @return true if the element is currently being validated, false otherwise.
	 */
	isValidating: function() {
		return this.validator.isValidating();
	}		
};

/**
 * Validation object. Validators must implement the doValidation() method and
 * can optionally implement pre- and post-validation handlers. The validation can
 * be cancelled by returning true from a preValidationHandler.
 * 
 * The doValidation() method should set the status and can also set a message.
 * 
 * This object must be extended to include an 'element' property.
 * 
 * @class Validator
 */
Interstellar.Validator = {
	status: null,
	message: null,
	
	/**
	 * Base validation function the contains 3 template methods. This is the function called
	 * by external objects when validating an element.
	 *
	 * @return true if the validation is valid, false otherwise.
	 */
	validate: function() {
		var cancelValidation = false;
		
		if (this.preValidationHandler) {
			cancelValidation = this.preValidationHandler();
			if (cancelValidation) { 
				this.status = Interstellar.CANCELLED;
			}
		}
		
		if (!cancelValidation) {
			this.doValidation();
			if (this.postValidationHandler) {
				this.postValidationHandler();
			}
			this.validationRenderer.updateView();
		}
		
		return Interstellar.VALID === this.status;
	},
	
	/**
	 * Returns the validation result object.
	 *
	 * @return the validation result object.
	 */
	result: function(status, message) {
		this.status = status;
		this.message = message;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return true if valid, false otherwise.
	 */
	isValid: function() {
		return this.status === Interstellar.VALID;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return true if invalid, false otherwise.
	 */
	isError: function() {
		return this.status === Interstellar.ERROR;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return true if in warning status, false otherwise.
	 */
	isWarning: function() {
		return this.status === Interstellar.WARNING;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return true if cancelled, false otherwise.
	 */
	isCancelled: function() {
		return this.status === Interstellar.CANCELLED;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return true if currently validating, false otherwise.
	 */
	isValidating: function() {
		return this.status === Interstellar.VALIDATING;
	}
};

/**
 * A validation renderer that works with Bootstrap 3 input styles.
 * 
 * @namespace Interstellar
 * @class Bootstrap3Renderer
 */
Interstellar.Bootstrap3Renderer = {
    validator: null,
    
	/**
	 * Updates the HTML view to indicate the validation status.
	 */
	updateView: function() {
		this.clearValidation();
		
		if (this.validator.isError()) {
			this.addValidation("has-error", "glyphicon glyphicon-remove");
		} else if (this.validator.isWarning()) {
			this.addValidation("has-warning", "glyphicon glyphicon-alert");
		} else if (this.validator.isValid()) {
			this.addValidation("has-success", "glyphicon glyphicon-ok");
		} else if (this.validator.isValidating()) {
			this.addValidation("", "glyphicon glyphicon-cog right-spinner");
		}
	},
	
	/**
	 * Returns the associated element's form group,
	 * 
	 * @return the associated element's form group. 
	 */
	formGroup: function() {
		return this.el().closest(".form-group");
	},
	
	/**
	 * Returns the associated element.
	 * 
	 * @return the associated element
	 */
	el: function() {
		return this.validator.element.el();
	},
	
	/**
	 * Adds the necessary HTML tags to the element to indicate the validation status.
	 * 
	 * @param type the class associated to the validation status.
	 * @param iconClass the icon associated to the validation status. 
	 */
	addValidation: function(type, iconClass) {
		this.formGroup().addClass("has-feedback " + type);
		var element = this.el();
		element.after("<span class='" + iconClass + " form-control-feedback'></span>");
		if (this.validator.message) {
			element.after("<div class='help-block input-msg'>" + this.validator.message + "</div>");
		}
	},	
	
	/**
	 * Clears the HTML of the validation status.
	 */
	clearValidation: function() {
		var formGroup = this.formGroup();
		formGroup.removeClass("has-feedback has-error has-success has-warning");
		formGroup.find('.form-control-feedback').remove();
		formGroup.find('.input-msg').remove();
	}
};

/**
 * A validator that checks if the input element has a value.
 * 
 * @namespace Interstellar
 * @class Validator
 */
Interstellar.RequiredValidator = Interstellar.validator({
	events: "focusout",
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

})();
