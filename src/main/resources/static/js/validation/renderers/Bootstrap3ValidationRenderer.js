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