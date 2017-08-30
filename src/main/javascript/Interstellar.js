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
Interstellar = (function() {
	/**
	 * The elements contained in this Interstellar page model.
	 * @type Array
	 */
	var elements = [],
	
	/**
	 * The data model. The data model contains the state of the elements and can be 
	 * used to pre-populate the element values and validation status.
	 * @type Object
	 */
	model = {},
	
	/**
	 * The id of the form which contains the model object.
	 * @type String
	 */
	formId = "intersellar-form",
	
	/**
	 * The name of the model object as contained in the form hidden input element.
	 * 	@type String
	 */
	modelName = "interstellar-model",
	
	/**
	 * The default validation renderer.
	 * @type Object
	 */
	defaultValidationRenderer = null,
	
	/**
	 * Syncs the data model with the element data.
	 * @return the updated data model
	 */
	syncModel = function() {
		var data = [];
		for (var i = 0, length = elements.length; i < length; i++) {
			var element = elements[i];
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
		
		$.extend(model, data);
	},
	
	/**
	 * Syncs the element data with the data model.
	 * @param element The element to update with model data.
	 */
	syncElement = function(element) {
		if (!element.name) {
			return;
		}
		
		for (var i = 0, length = model.length; i < length; i++) {
			var modelElement = model[i];
			
			if (element.name === modelElement.name) {
				element.val(modelElement.value);
				
				if (element.validator) {
					element.validator.status = modelElement.status;
					element.validator.message = modelElement.validator.message;
				}
				
				return;
			}
		}
	};
	
	return {
		/**
		 * Initializes the Interstellar object.
		 */
		init: function(config) {
			if (config.formId) {
				formId = config.formId;
			}
			
			if (config.modelName) {
				modelName = config.modelName;
			}
			
			if (config.defaultValidationRenderer) {
				defaultValidationRenderer = config.defaultValidationRenderer;
			}
			
			// Check if there is a model object in the form and update the data model
			var modelInputElement = $("#" + formId + " input[name='" + modelName + "']");
			if (modelInputElement) {
				model = JSON.parse(modelInputElement.val());
			}
		},
		
		/**
		 * Validates all elements currently registered with Interstellar.
		 * @return True if all elements are valid, false otherwise.
		 */
		validate: function() {
			var isValid = true;
			for (var i = 0; i < elements.length; i++) {
				if (elements[i].validator) {
					isValid = isValid & elements[i].validate();
				}
			}
			return isValid;
		},
		
		/**
		 * Gets the current data model by syncing with the element data.
		 * @return The data model.
		 */
		getModel: function() {
			syncModel();
			return model;
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
			elements.push(element);
			
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
				} else if (defaultValidationRenderer) {
					// Next see if we have a default validation renderer
					element.validationRenderer = $.extend({}, defaultValidationRenderer);
				} else {
					// If no renderer specified use the default for Bootstrap3
					defaultValidationRenderer = Interstellar.Bootstrap3ValidationRenderer;
					element.validationRenderer = $.extend({}, defaultValidationRenderer);
				}
				element.validator.validationRenderer = element.validationRenderer;
				element.validationRenderer.validator = element.validator;
			}
			
			syncElement(element);
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
	}
	
})();

})();