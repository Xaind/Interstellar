(function() {
"use strict";

var $page = $app.namespace("page");

// Invoice date page element
$page.invoiceDate = Interstellar.element({
	id: "invoice-date",
	name: "invoiceDate",
	type: "date",
	
	listeners: [{
		events: "click",
		callback: function() {
			console.log("Listener: " + this.element.id + " clicked!");
			console.log("Data: " + JSON.stringify(Interstellar.data()));
		}
	}],
	
	validator: Interstellar.validator({
		events: "focusout",
		
		preValidationHandler: function() {
			console.log("Pre-validation: " + this.element.id);
			return false;
		},
		
		doValidation: function() {
			console.log("Validating: " +  this.element.id);
			this.message = "Validation was successful!";
			this.status = Interstellar.SUCCESS;
		},
		
		postValidationHandler: function() {
			console.log("Post-validation: " + this.element.id);
		}
	})
});

})(); 