// ---------------------------------------------------------------------------------------------------
// Copyright 2017, NTI Limited ABN 84 000 746 109.
// ---------------------------------------------------------------------------------------------------
// JS Validation Framework
// ---------------------------------------------------------------------------------------------------
(function() {
"use strict";

// ---------------------------------------------------------------------------------------------------
// Validation utility object. Provides validator registration and global call capability. This object
// will be accessible via $app.validation
// ---------------------------------------------------------------------------------------------------
$app.validation = {	
	validators: {},
	configs: [],
	
	register: function(config) {
		this.configs.push(config);
		var element = $(config.selector + " input");
		var $this = this;
		
		if (config.events) {
			// Register the validator with the input events
			var eventCallback = function(event) {
				if (!config.preEventHandler || config.preEventHandler(event)) {
					$this.updateField(config, config.validator.validate(config));
				}
				if (config.postEventHandler) {
					config.postEventHandler(event);
				}
			};
			
			var onEnterCallback = function(event) {
				if (event.which === 13) {
					eventCallback(event);
				}
			};

			for(var i = 0; i < config.events.length; i++){
				var event = config.events[i];
				if (event === "onenter") {
					element.on("keypress", onEnterCallback);
				}  else {
					element.on(event, eventCallback);
				}
			}
		}
	},
	
	validate: function(selector, force) {
		for (var i = 0; i < this.configs.length; i++) {
			var config = this.configs[i];
			if (config.selector === selector) {
				this.updateField(config, config.validator.validate(config, force));
			}
		}
	},
	
	validateAll: function(excludedSelectors) {
		var isValid = true;
		for (var i = 0; i < this.configs.length; i++) {
			var config = this.configs[i];

			// Don't validate any excluded selectors
			if (!excludedSelectors || $.inArray(config.selector, excludedSelectors) === -1) {
				this.updateField(config, config.validator.validate(config));
				if (config.lastOutcome === "error") {
					isValid = false;
				}
			}
		}
		return isValid;
	},
	
	isValid: function(selector) {
		for (var i = 0; i < this.configs.length; i++) {
			var config = this.configs[i];
			if (config.selector === selector) {
				var result = config.validator.validate(config);
				this.updateField(config, result);
				
				if (result.outcome === "error" || (result.outcome === "no-op" && config.lastOutcome === "error")) {
					return false;
				}
			}
		}
		return true;
	},
	
	updateField: function(config, result) {
		if (result.outcome === "no-op" ) {
			return; 
		}
		config.lastOutcome = result.outcome;
		
		// Update the field styling and messages
		var formGroup = $(config.selector);
		var inputGroup = formGroup.find('.input-group');
		if (inputGroup.length === 0) {
			inputGroup = formGroup.find('input');
		}
		
		this.clearValidation(config.selector);
		
		if (!result) {
			return;
		} else if (result.outcome === "error") {
			this.addValidation(formGroup, inputGroup, "has-error", "fa fa-times", result);
		} else if (result.outcome === "warning") {
			this.addValidation(formGroup, inputGroup, "has-warning", "fa fa-exclamation", result);
		} else if (result.outcome === "success") {
			this.addValidation(formGroup, inputGroup, "has-success", "fa fa-check", result);
		} else if (result.outcome === "validating") {
			this.addValidation(formGroup, inputGroup, "", "glyphicon glyphicon-cog right-spinner", result);
		}
		
		return result;
	},
	
	addValidation: function(formGroup, inputGroup, type, iconClass, result) {
		formGroup.addClass("has-feedback " + type);
		inputGroup.after("<span class='" + iconClass + " form-control-feedback'></span>");
		if (result.msg) {
			inputGroup.after("<div class='help-block input-msg'>" + result.msg + "</div>");
		}
	},	
	
	clearValidation: function(selector) {
		var formGroup = $(selector);
		formGroup.removeClass("has-feedback has-error has-success has-warning");
		formGroup.find('.form-control-feedback').remove();
		formGroup.find('.input-msg').remove();
	}
};
	
// -------------------------------------------------------------------------------------------------------
// Validator base object. Provides value caching to prevent unnecessary revalidation. This object will be
// available via $app.validator.base
// -------------------------------------------------------------------------------------------------------
$.extend($app.validation.validators, {base: {
	validate: function(config, force) {
		// Check the previous value so we don't have to re-run validation
		var element = $(config.selector + " input");
		if (element.val() === config.previousValue && !force) {
			return {outcome: "no-op"};
		} else {
			config.previousValue = element.val();
		} 
		
		return this.doValidation(config);
	},
	
	doValidation: function(config) {
		throw new Error("This should be overridden by specific validators");
	},
	
	validateField: function(selector) {
		$app.validation.validate(selector);
	},
	
	update: function(config, response) {
		$app.validation.updateField(config, response);
	},
	
	value: function(config) {
		return $(config.selector + " input").val();
	},
	
	show: function(selectors) {
			$.each(selectors, function(index, selector) {
				$(selector).removeClass("hidden");
			});
	},
	
	hide: function(selectors) {
		$.each(selectors, function(index, selector) {
			$(selector).addClass("hidden");
			$(selector + " input").val("");
			$app.validation.clearValidation(selector);
			
			// Make sure we clear any previous value
			var configs = $app.validation.configs;
			for (var i = 0; i < configs.length; i++) {
				var config = configs[i];
				if (config.selector === selector) {
					config.previousValue = null;
				}
			}
		});
	}
}});
	
// ---------------------------------------------------------------------------------------------------
// Generic required validator. This object will be available via $app.validator.required
// ---------------------------------------------------------------------------------------------------
$.extend($app.validation.validators, {
	required: Object.create($app.validation.validators.base, {
		doValidation: {
			value: function(config) {
				var element = $(config.selector + " input");
				if (!element.val()) {
					return {outcome: "error", msg: config.msg.error};
				} else {
					return {outcome: "success", msg: config.msg.success};
				}
			}
		}
	})
});

}());
