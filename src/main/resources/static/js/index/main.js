// ---------------------------------------------------------------------------------------------------
// Copyright 2017, NTI Limited ABN 84 000 746 109.
// ---------------------------------------------------------------------------------------------------
// Define global JS objects
// ---------------------------------------------------------------------------------------------------
var $Env = {};
var $Util = {};
var $Page = {};

(function() {
"use strict";

// ---------------------------------------------------------------------------------------------------
// Initialize the environment variables. These variables are set using <meta> tags in the <head>.
// eg. <meta name="env-context-path" content="/claims" />
// The name of the variable will be converted to camel-case and accessible via $Env. The env-
// prefix is dropped from the name, so the above example will be available via $Env.CONTEXT_PATH
// ---------------------------------------------------------------------------------------------------
var envMetas = $("meta[name^='env-']" );

for (var i = 0; i < envMetas.length; i++) {
	var meta = $(envMetas[i]);
	var prop = meta.attr("name").replace("env-", "");
	var content = meta.attr("content");
	
	if (!content) {
		content = "";
	}
	
	prop = prop.replace("-", "_").toUpperCase();
	$Env[prop] = content;
}

//---------------------------------------------------------------------------------------------------
// Define the high-level utility functions. These are accessible via $app.util.
//---------------------------------------------------------------------------------------------------
$Util = {
		
	logout:  function() {
		$("#logout-form").submit();
	},

	format: function(type, value) {
		if (value || value === 0) {
			if (type === "currency") {
				var formatter = new Intl.NumberFormat("en-AU", {
				  style: "currency",
				  currency: "AUD",
				  minimumFractionDigits: 2
				});
				return formatter.format(value);
			} else if (type === "date") {
				return moment(value, "DD MMMM YYYY").format("D MMMM YYYY");
			}
		}
		return value;
	},

	round: function(value, decimals) {
		if (!decimals) {
			decimals = 0;
		}
		return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals);
	},

	hide: function(selectors) {
		this.showHide(selectors, false);
	},

	show: function(selectors) {
		this.showHide(selectors, true);
	},

	showHide: function(selectors, show) {
		if (selectors) {
			for (var i = 0; i < selectors.length; i++) {
				if (show) {
					$(selectors[i]).removeClass("hidden");
				} else {
					$(selectors[i]).addClass("hidden");
				}
			}
		}
	},

	formToJson: function(formSelector) {
		var inputElements = $(formSelector).serializeArray();
		var json = {};
		for (var i = 0; i < inputElements.length; i++){
			json[inputElements[i].name] = inputElements[i].value;
		}
		return json;
	},
	
	toKB: function(value) {
		var size = parseInt(value, 10);
		var unit = value.replace(size, "").toLowerCase();
		
		switch (unit) {
		    case "":
		    case "b":
		        return size / 1024;
		    case "kb":
		    	return size;
		    case "mb":
		    	return size * 1024;
		    default:
		        return null;
		}
	},
	
	isNonEnterKeypress: function(event) {
		return event.type === "keypress" && event.which !== 13; 
	}
};

}());
