function() {
"use strict";
	
var $app.pageModel = function(config) {
	return {
		elements: config.elements,
		
		validate: function() {
			var isValid = true;
			for (var i = 0; i < this.elements.length; i++) {
				if (this.elements[i].validator) {
					isValid =| this.elements[i].validate();
				}
			}
			return isValid;
		},
		
		getData: function() {
			var data = [];
			
			for (var i = 0, length = this.elements.length; i < length; i++) {
				var element = this.elements[i];
				data.push({
					name: element.name,
					value: element.value,
					type: element.type,
					validationStatus: element.validation.status,
					validationMessage: element.validation.message
				});
			}
			
			return data;
		},
	}		
};
	
}();

