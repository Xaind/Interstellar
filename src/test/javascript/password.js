(function() {
"use strict";

$Page.password = Interstellar.element({
	name: "password",
	type: "string",
	
	validator: Interstellar.validator({
		errorMessage: "A password is required."
	}, Interstellar.RequiredValidator),
});

})(); 