"use strict"
var app = angular.module("swen");
app.controller("Controller", [	
	"$scope", 
	"modeService", 
function($scope, modeService){

        $scope.status = function() {console.log(JSON.stringify(Posts.find().fetch()));}; 

	// Get options for the drop-down menu:
	$scope.modes = modeService.getModes();

	// For some reason ng-selected is not enough to set mode, so . . .
	$scope.mode = modeService.getCurrentMode();

	// Prepare a blank draft that can be prepared for the user.
	$scope.draft = {text: ""};

	$scope.click = function click(post, $event) {
		if ($scope.mode !== "browse" && $event) $event.preventDefault();
		var args = {post: post, event: $event, scope: $scope};
console.log(JSON.stringify(post));
		modeService[$scope.mode].click(args);
	}
	// Load the first page
	var path = location.pathname.slice(1);
	$scope.click({_id: path});

	$scope.getClass = function getClass(post) {
		var getClass = modeService[$scope.mode].getClass;
		return getClass ? getClass(post) : "";
	}

	$scope.submit = function submit(post, $event) {
		modeService[$scope.mode].submit({post: post, scope: $scope, event: $event});
	}

	$scope.msgToUser = "";

        // Each post uses this function to find out if it should be a textarea or not.
        $scope.isEditable = function isEditable(post) {
		if ($scope.mode === "edit")
                	return modeService[$scope.mode].isEditable(post);
		else return false;
        }

}]);
