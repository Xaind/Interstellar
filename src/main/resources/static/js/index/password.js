(function() {
"use strict";

$Page.password = Interstellar.element({
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
	
	validator: Interstellar.validator({
		errorMessage: "A password is required."
	}, Interstellar.RequiredValidator),
});

})(); 