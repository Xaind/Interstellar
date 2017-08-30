/*
 * Interstellar Javascript Framework
 * https://github.com/Xaind/interstellar
 * Copyright 2017, Xaind; Licensed MIT
 */
(function() {
"use strict";

/**
 * Page element definition. An element typically represents a HTML input element but can be used
 * any HTML element such as a button, link or even a div. An element is created by passing in a
 * configuration object to Interstellar.element(). 
 * 
 * @module Interstellar.Element
 */
Interstellar.Element = (function() {
	/**
	 * Binds a function to an event on the element. Typically used to bind onclick listeners and validation callbacks.
	 * This function is not intended to be accessed directly, it is called by the registerXXX() functions.
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
						callback.call(context);
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
			} else {
				return $("#" + this.name);
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
			if (!this.listener) {
				this.listener = [];
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

})();