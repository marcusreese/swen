"use strict"
var app = angular.module("swen");
app.controller("Controller", [	
	"$scope", 
	"$meteor", 
	"$stateParams", 
	"modeService", 
function($scope, $meteor, $stateParams, modeService){

        $scope.status = function() {console.log(JSON.stringify(Posts.find().fetch()));}; 

	// Get options for the drop-down menu:
	$scope.modes = modeService.getModes();

	// For some reason ng-selected is not enough to set mode, so . . .
	$scope.mode = modeService.getCurrentMode();

	// Prepare a blank draft that can be prepared for the user.
	$scope.draft = {text: ""};

	$scope.click = function click(post) {
		modeService[$scope.mode].click(post, $scope.draft);
	}

	$scope.getClass = function getClass(post) {
		var getClass = modeService[$scope.mode].getClass;
		return getClass ? getClass(post) : "";
	}

	$scope.submit = function submit(draft, post) {
		modeService[$scope.mode].submit(draft, post, $scope.subpage);
	}

	$scope.msgToUser = "";

        $scope.subpage = $meteor.collection(function () {
                return Posts.find({}, {sort: {rank: 1}});
                //return Posts.find({_id: $stateParams.username + "/" + $stateParams.slug}, {sort: {rank: 1}});
        });

        // Each post uses this function to find out if it should be a textarea or not.
        $scope.isEditable = function isEditable(post) {
		if ($scope.mode === "edit")
                	return modeService[$scope.mode].isEditable(post);
		else return false;
        }
}]);
