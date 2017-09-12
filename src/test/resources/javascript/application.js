var $app = $app || {};

(function() {
"use strict";

$app.namespace = function(ns_string) {
	var parts = ns_string.split('.');
	var parent = $app;
	
	// Strip redundant leading global
	if (parts[0] === "$app") {
		parts = parts.slice(1);
	}
	
	for (var i = 0; i < parts.length; i += 1) {
		// Create a property if it doesn't exist
		if (typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	
	return parent;
};

})();
