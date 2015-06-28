"use strict";
var app = angular.module("swen");
app.run(["modeService", function addBrowse(modeService) {
	// Make this the default mode.
	modeService.addMode("Browse", browse, "default");
}]);

function browse() { 
	var selectedId = "";
	return {
		getClass: function getClass(post) {
			return post._id === selectedId ? "selected" : "";
		},
		click: function click(post) {
			selectedId = post._id;
		}
	};
}
