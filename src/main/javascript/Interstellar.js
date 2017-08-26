/*
 * Interstellar Javascript Framework
 * https://github.com/Xaind/interstellar
 * Copyright 2017, Xaind; Licensed MIT
 */

/**
 * The Interstellar namespace. The main Interstellar object is attached to the Global namespace.
 * @namespace Interstellar
 */
var Interstellar = {};

(function() {
"use strict";

/**
 * The top-level object which manages the page model. HTML fields are typically
 * add via calls to Interstellar.element(). Helper functions are provided for
 * validation and for getting and setting the model via JSON.
 * 
 * @module Interstellar
 */
$.extend(Interstellar, {
	/**
	 * The elements contained in this Interstellar page model.
	 * @type Array
	 */
	elements: [],
	
	/**
	 * Validates all elements currently registered with Interstellar.
	 * @return True if all elements are valid, false otherwise.
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
	 * @param data The data model to set.
	 * @return The data model.
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
	 * @param config The element configuration.
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
				element.validator.validationRenderer = $.extend({}, Interstellar.Bootstrap3ValidationRenderer);
				element.validator.validationRenderer.validator = element.validator;
			}
		}
		
		return element;
	},

	/**
	 * Creates a validator based on the specified config. If a baseValidator
	 * is specified then it will used as a basis.
	 * 
	 * @param config The validation config.
	 * @param baseValidator The validator used for extension.
	 * @return A new validator.
	 */
	validator: function(config, baseValidator) {
		if (!baseValidator) {
			baseValidator = Interstellar.BaseValidator;
		}
		return $.extend({}, baseValidator, config);
	},
	
	/**
	 * Validation status constant for VALID.
	 */
	VALID: "valid",
	
	/**
	 * Validation status constant for ERROR.
	 * @type String
	 */
	ERROR: "error",
	
	/**
	 * Validation status constant for WARNING.
	 * @type String
	 */
	WARNING: "warning",
	
	/**
	 * Validation status constant for CANCELLED.
	 * @type String
	 */
	CANCELLED: "cancelled",
	
	/**
	 * Validation status constant for VALIDATING.
	 * @type String
	 */
	VALIDATING: "validating"
});

})();