(function() {
"use strict";

$Page.username = Interstellar.element({
	name: "username",
	type: "text",
	
	listeners: [{
		events: "click",
		callback: function() {
			console.log("Listener: " + this.element.name + " clicked!");
			console.log("Data: " + JSON.stringify(Interstellar.data()));
		}
	}, {
		events: "enterkey",
		callback: function() {
			console.log("Listener: " + this.element.name + " onenterkey!");
		}
	}],
	
	validator: Interstellar.validator({
			events: ["focusout","enterkey"],
			errorMessage: "A username is required."
		}, Interstellar.RequiredValidator),
});

})(); 