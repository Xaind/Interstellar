(function() {
"use strict";

$(function() {
	var $p = $app.pageModel;
	$p({
		pageElements: [
			$p.invoiceDate,
			$p.policyNumber
		]
	});
});

})(); 