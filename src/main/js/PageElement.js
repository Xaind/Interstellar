function() {
"use strict";

var $app.pageElement = function(config) {
	
	// Bind the event listeners
	if (config.eventCallbacks) {
		for (var i = 0, length = config.eventCallbacks.length; i < length; i++) {
			var eventCallback = config.eventCallbacks[i];
			bindEventCallback(eventCallback.events, eventCallback.execute);
		}
	}
	
	// Bind the validator
	if (config.validation) {
		bindEventCallback(config.validation.events, config.validation.validator.validate);
	}
	
	this.bindEventCallback = function(events, callback) {
		for (var j = 0, length = events.length; j < length; j++) {
			$("#" + config.id).on(events[j], callback.call(config.pageElement));
		}
	}
	
	// Define the page element
	return {
		id: config.id,
		name: config.name,
		type: config.type,
		
		validation: {
			validator: config.validation.validator,
			status: null,
			message: null			
		},
		
		el: function() {
			return $("#" + config.id);
		},
		
		val: function(value) {
			if (typeof val === "undefined") {
				return this.el().val();
			}	
			this.el().val(value);
		},
		
		validate: function() {
			return this.validation.validator.validate(this);
		},
		
		isValid: function() {
			return this.vaidation.status === "success";	
		}		
	}
};

}();