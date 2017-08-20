function() {
"use strict";

var $p = $app.pageModel;

var $p.invoiceDate = $p.pageElement({
	id: "invoice-date",
	name: "invoiceDate",
	type: "date",
	
	eventCallbacks: [{
		callback: function() {
			alert(this.id + " clicked!");
		},
		events: ["focusout"]
	},
	
	validation: {
		validator: $p.invoiceDateValidator,
		events: ["focusout"]	
	}
});

var $p.invoiceDateValidator = $.extends({}, $v.base, {
	doValidation: function() {
		alert("Validating invoice date!");
	}	
});

}(); 