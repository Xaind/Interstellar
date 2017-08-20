(function() {
"use strict";

$app.Validator = function(validationFunction) {
	
	return {
		status: null,
		message: null,
		
		preValidationHandler: function() {
			// Implemented by subclasses
		},
		
		postValidationHandler: function() {
			// Implemented by subclasses
		},
		
		validate: function(event) {
			var $this = event.data;
			$this.preValidationHandler();
			$this.doValidation();
			$this.postValidationHandler();
		},
		
		doValidation: validationFunction
	};
};
	
})();