(function() {
"use strict";

$Page.username = Element.create({
	name: "username",
	type: "string",
	
	init: function() {
		alert("Initialized username field!");
	},
	
	listeners: [{
		events: "click",
		callback: function() {
			console.log("Listener: " + this.name + " clicked!");
			console.log("Data: " + JSON.stringify(Element.getModel()));
		}
	}, {
		events: "enterkey",
		callback: function() {
			console.log("Listener: " + this.name + " onenterkey!");
		}
	}],
	
	validator: Element.validator({
			events: ["focusout","enterkey"],
			errorMessage: "A username is required."
		}, Element.RequiredValidator),
		
	customFunction: function() {
		alert("Custom function!");
		this.clearValidation();
	}
});

})(); 
