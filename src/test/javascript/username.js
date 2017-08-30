(function() {
"use strict";

$Page.username = Interstellar.element({
	name: "username",
	type: "string",
	
	listeners: [{
		events: "click",
		callback: function() {
			console.log("Listener: " + this.name + " clicked!");
			console.log("Data: " + JSON.stringify(Interstellar.getModel()));
		}
	}, {
		events: "enterkey",
		callback: function() {
			console.log("Listener: " + this.name + " onenterkey!");
		}
	}],
	
	validator: Interstellar.validator({
			events: ["focusout","enterkey"],
			errorMessage: "A username is required."
		}, Interstellar.RequiredValidator),
});

})(); 