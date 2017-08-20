(function() {
"use strict";

$(function() {
	var $p = $app.pageModel;
	
	$p.invoiceDateValidator = new $app.Validator(function() {
		alert("Validating " +  $p.invoiceDate.id + "!");
	});
	
	$p.invoiceDate = $p.pageElement({
		id: "invoice-date",
		name: "invoiceDate",
		type: "date",
		
		eventCallbacks: [{
			callback: function(event) {
				alert(event.data.id + " clicked!");
			},
			events: ["click"]
		}],
		
		validation: {
			validator: $p.invoiceDateValidator,
			events: ["focusout"]	
		}
	});
	
});

})(); 