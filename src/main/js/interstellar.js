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
	
	validate: function() {
		var isValid = true;
		for (var i = 0; i < this.elements.length; i++) {
			if (this.elements[i].validator) {
				isValid = isValid & this.elements[i].validate();
			}
		}
		return isValid;
	},
	
	data: function(data) {
		if (data) {
			// Convert the incoming data into a model
			
			
		} else {
			// Output the current model as JSON
			var data = [];
			for (var i = 0, length = this.elements.length; i < length; i++) {
				var element = this.elements[i];
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
	 * Creates a page element based on the specified config. 
	 */
	element: function(config) {
		var element = $.extend({}, Interstellar.Element, config);
		this.elements.push(element);
		
		if (element.listeners) {
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
			} else {
				// Use the default validation renderer
				element.validator.validationRenderer = Interstellar.ValidationRenderer;
			}
		}
		
		return element;
	},

	/**
	 * Creates a validator based on the specified config. 
	 */
	validator: function(config) {
		return $.extend({}, Interstellar.Validator, config);
	},

	/**
	 * Represents a validation result.
	 */
	SUCCESS: "success",
	ERROR: "error",
	WARNING: "warning",
	CANCELLED: "cancelled"
});

/**
 * Page element definition.
 * 
 * @class Element
 */
Interstellar.Element = {		
	id: null,
	name: null,
	type: null,
	validator: null,
	listeners: [],
	
	el: function() {
		return $("#" + this.id);
	},
	
	bind: function(callback, events) {
		if (!(events instanceof Array)) {
			events = [events];
		}
		
		for (var j = 0, length = events.length; j < length; j++) {
			this.el().on(events[j], this, callback);
		}
	},
	
	value: function(value) {
		if (typeof value === "undefined") {			
			return this.el().val();
		}		
		this.el().val(value);
	},
	
	registerListener: function(listener) {
		this.listeners.push(listener);
		this.bind(function() {
			listener.callback();
		}, listener.events);
	},
	
	registerValidator: function(validator) {
		this.validator = validator;
		this.bind(function() {
			return validator.validate();
		}, validator.events);
	},
	
	validate: function() {
		return this.validator.validate();
	},
	
	isValid: function() {
		return this.validator.isSuccess();
	},
	
	isError: function() {
		return this.validator.isError();
	},	
	
	isWarning: function() {
		return this.validator.isWarning();
	},		
	
	isCancelled: function() {
		return this.validator.isCancelled();
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
		}
		
		this.validationRenderer.updateView();
		return Interstellar.SUCCESS === this.status;
	},
	
	isValid: function() {
		return this.status === Interstellar.SUCCESS;
	},
	
	isError: function() {
		return this.status === Interstellar.ERROR;
	},
	
	isWarning: function() {
		return this.status === Interstellar.WARNING;
	},
	
	isCancelled: function() {
		return this.status === Interstellar.CANCELLED;
	}
};

Interstellar.ValidationRenderer = {
	updateView: function() {
		console.log("Default validation renderer!");
	}
};

})();
