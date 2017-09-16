/*
 * Interstellar Javascript Framework
 * https://github.com/xaind/interstellar
 * Copyright 2017, Xaind; Licensed Apache 2.0
 */

/**
 * The Interstellar namespace. The main Interstellar object is attached to the Global namespace.
 * @namespace Interstellar
 */
var Interstellar = {};

/**
 * The top-level object which manages the page model. HTML fields are typically
 * added via calls to Interstellar.element(). Helper functions are provided for
 * validation and for getting and setting the model via JSON.
 * 
 * @module Interstellar
 */
Interstellar = (function() {
	"use strict";
	
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
			
			// Run any custom initialization code
			if (element.init) {
				element.init();
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
	}
	
})();
/*
 * Interstellar Javascript Framework
 * https://github.com/xaind/interstellar
 * Copyright 2017, Xaind; Licensed Apache 2.0
 */
/**
 * Page element definition. An element typically represents a HTML input element but can be used
 * any HTML element such as a button, link or even a div. An element is created by passing in a
 * configuration object to Interstellar.element(). 
 * 
 * @module Interstellar.Element
 */
Interstellar.Element = (function() {
	"use strict";
	
	/**
	 * Binds a function to an event on the element. Typically used to bind onClick listeners and validation callbacks.
	 * This function is not intended to be accessed directly, it is called by the event registration function.
	 * 
	 * @param callback The callback function to execute.
	 * @param events An array of events to bind the callback to the element.
	 */
	var bind = function(context, callback, events) {
		if (!(events instanceof Array)) {
			events = [events];
		}
		
		for (var j = 0, length = events.length; j < length; j++) {
			var event = events[j];
			if (event === "enterkey") {
				context.el().on("keypress", function(e) {
					if (e.which === 13) {
						callback.call(context, e);
					}
				});
			}  else {
				context.el().on(events[j], context, callback);
			}
		}
	};
	
	return {		
		/**
		 * Returns the jQuery object that represents this element.
		 * @return The associated jQuery object.
		 */
		el: function() {
			if (this.id) {
				return $("#" + this.id);
			} else if (this.name) {
				return $("#" + this.name);
			} else {
				console.error("Error getting element target. No id or a name property has been defined!");
			}
		},
		
		/**
		 * Sets or returns the value assigned to this element. If a value is specified then
		 * this acts as a setter otherwise it will return the currently assigned value.
		 *
		 * @param value The value to assign (should be undefined when getting the value).
		 * @return The current value assigned to this element.
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
		 * @param listener The listener to bind.
		 */
		registerListener: function(listener) {
			if (!this.listeners) {
				this.listeners = [];
			}
			this.listeners.push(listener);
			bind(this, listener.callback, listener.events);
		},
		
		/**
		 * Registers a validator with this element. The validator will contain an array of events that will
		 * trigger the validation. It will also contain the validation callback function.
		 *
		 * @param validator The validator to bind.
		 */
		registerValidator: function(validator) {
			this.validator = validator;
			bind(this, function() {
				validator.validate();
			}, validator.events);
		},
		
		/**
		 * Calls this element's validators. If you just need to check the current validation status
		 * then use one of the status check functions below.
		 *
		 * @return True if the element is valid, false otherwise.
		 */
		validate: function() {
			return this.validator.validate();
		},
		
		/**
		 * Clears the validation styling for this element.
		 */
		clearValidation: function() {
			this.validator.validationRenderer.clearValidation();
		},
		
		/**
		 * Checks the current validation status.
		 *
		 * @return True if the element is valid, false otherwise.
		 */
		isValid: function() {
			return this.validator.isSuccess();
		},
		
		/**
		 * Checks the current validation status.
		 *
		 * @return True if the element is invalid, false otherwise.
		 */
		isError: function() {
			return this.validator.isError();
		},	
		
		/**
		 * Checks the current validation status.
		 *
		 * @return True if the element is in warning status, false otherwise.
		 */
		isWarning: function() {
			return this.validator.isWarning();
		},		
		
		/**
		 * Checks the current validation status.
		 *
		 * @return True if the element's validation has been cancelled, false otherwise.
		 */
		isCancelled: function() {
			return this.validator.isCancelled();
		},		
		
		/**
		 * Checks the current validation status.
		 *
		 * @return True if the element is currently being validated, false otherwise.
		 */
		isValidating: function() {
			return this.validator.isValidating();
		}	
	}
})();
/*
 * Interstellar Javascript Framework
 * https://github.com/xaind/interstellar
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
 * @module Interstellar.BaseValidator
 */
Interstellar.BaseValidator = {
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
		return this.status === Interstellar.VALID;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return True if invalid, false otherwise.
	 */
	isError: function() {
		return this.status === Interstellar.ERROR;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return True if in warning status, false otherwise.
	 */
	isWarning: function() {
		return this.status === Interstellar.WARNING;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return True if cancelled, false otherwise.
	 */
	isCancelled: function() {
		return this.status === Interstellar.CANCELLED;
	},
	
	/**
	 * Validation status check.
	 *
	 * @return True if currently validating, false otherwise.
	 */
	isValidating: function() {
		return this.status === Interstellar.VALIDATING;
	}
};

/*
 * Interstellar Javascript Framework
 * https://github.com/Xaind/interstellar
 * Copyright 2017, Xaind; Licensed Apache 2.0
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
/*
 * Interstellar Javascript Framework
 * https://github.com/Xaind/interstellar
 * Copyright 2017, Xaind; Licensed Apache 2.0
 */

/**
 * A validation renderer that works with Bootstrap 3 input styles.
 * 
 * @module Interstellar.Bootstrap3ValidationRenderer
 */
Interstellar.Bootstrap3ValidationRenderer = {
	/**
	 * A back reference to this renderer's validator.
	 */
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
	 * Returns the associated element's form group.
	 * @return The associated element's form group. 
	 */
	formGroup: function() {
		return this.el().closest(".form-group");
	},
	
	/**
	 * Returns the associated element.
	 * @return The associated element.
	 */
	el: function() {
		return this.validator.element.el();
	},
	
	/**
	 * Adds the necessary HTML tags to the element to indicate the validation status.
	 * 
	 * @param type The class associated to the validation status.
	 * @param iconClass The icon associated to the validation status. 
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
