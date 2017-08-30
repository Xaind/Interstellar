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
	 * The data model. The data model contains the state of the elements and can be 
	 * used to pre-populate the element values and validation status.
	 * @type Object
	 */
	model: {},
	
	/**
	 * The id of the form which contains the model object.
	 * @type String
	 */
	formId: "intersellar-form",
	
	/**
	 * The name of the model object as contained in the form hidden input element.
	 * 	@type String
	 */
	modelName: "interstellar-model",
	
	/**
	 * The default validation renderer.
	 * @type Object
	 */
	defaultValidationRenderer: Interstellar.Bootstrap3ValidationRenderer,
	
	/**
	 * Initializes the Interstellar object.
	 */
	init: function(config) {
		if (config.formId) {
			this.formId = config.formId;
		}
		
		if (config.modelName) {
			this.modelName = config.modelName;
		}
		
		if (config.defaultValidationRenderer) {
			this.defaultValidationRenderer = config.defaultValidationRenderer;
		}
		
		// Check if there is a model object in the form and update the data model
		var modelInputElement = $("#" + this.formId + " input[name='" + this.modelName + "']");
		if (modelInputElement) {
			this.model = JSON.parse(modelInputElement.val());
		}
	},
	
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
	 * Gets the current data model by syncing with the element data.
	 * @return The data model.
	 */
	getModel: function() {
		this.syncModel();
		return this.model;
	},
	
	/**
	 * Syncs the data model with the element data.
	 * @return the updated data model
	 */
	syncModel: function() {
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
		
		$.extend(this.model, data);
	},
	
	/**
	 * Syncs the element data with the data model.
	 * @param element The element to update with model data.
	 */
	syncElement: function(element) {
		if (!element.name) {
			return;
		}
		
		for (var i = 0, length = this.model.length; i < length; i++) {
			var modelElement = this.model[i];
			
			if (element.name === modelElement.name) {
				element.val(modelElement.value);
				
				if (element.validator) {
					element.validator.status = modelElement.status;
					element.validator.message = modelElement.validator.message;
				}
				
				return;
			}
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
		var element = $.extend(config, Interstellar.Element);
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
				element.validator.validationRenderer = $.extend({}, this.defaultValidationRenderer);
				element.validator.validationRenderer.validator = element.validator;
			}
		}
		
		this.syncElement(element);
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
		return $.extend(config, baseValidator);
	}	
});

})();