(function() {
"use strict";
	
$app.pageModel = function(config) {
	return {
		pageElements: config.pageElements,
		
		validate: function() {
			var isValid = true;
			for (var i = 0; i < this.pageElements.length; i++) {
				if (this.pageElements[i].validator) {
					isValid = isValid & this.pageElements[i].validate();
				}
			}
			return isValid;
		},
		
		getData: function() {
			var data = [];
			
			for (var i = 0, length = this.pageElements.length; i < length; i++) {
				var pageElement = this.pageElements[i];
				data.push({
					name: pageElement.name,
					value: pageElement.value,
					type: pageElement.type,
					validationStatus: pageElement.validation.status,
					validationMessage: pageElement.validation.message
				});
			}
			
			return data;
		},
	}		
};
	
})();

