(function() {
"use strict";

$Page.password = Element.create({
	name: "password",
	type: "string",
	
	listeners: [{
		events: "keypress",
		callback: function(event) {
			if (event.which === 65) {
				$Page.username.customFunction();
			}			
		}
	}],
	
	validator: Element.validator({
		errorMessage: "A password is required."
	}, Element.RequiredValidator),
});

})(); 