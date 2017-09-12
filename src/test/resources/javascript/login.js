(function() {
"use strict";

$Page.loginBtn = Interstellar.element({
	id: "login-btn",
	
	listeners: {
		events: "mousedown",
		callback: function() {
			Interstellar.validate();
			alert("Login submitted! Data: " + JSON.stringify(Interstellar.getModel()));
		}
	}
});

})(); 