var app = angular.module("swen");
app.directive("myHref", function() {
	var linkFunction = function(scope, element, attributes) {
		var route = scope.$eval(attributes["myHref"]); 
		element.attr("href", route);
	};
	return {
		restrict: "A",
		//template: "href='{{route}}'",
		link: linkFunction,
		//scope: {}
	}; 
});
