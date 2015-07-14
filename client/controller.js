"use strict"
var app = angular.module("swen");
app.controller("Controller", [	
	"$scope", 
	"$rootScope",
	"modeService", 
function($scope, $rootScope, modeService){

        $scope.status = function() {console.log(JSON.stringify(Posts.find().fetch()));}; 

	// Get options for the drop-down menu:
	$scope.modes = modeService.getModes();

	// For some reason ng-selected is not enough to set mode, so . . .
	$scope.mode = modeService.getCurrentMode();

	// Prepare a blank draft that can be prepared for the user.
	$scope.draft = {text: ""};

	$scope.click = function click(post, $event) {
		if (! $event) {
			// Initial load
			$rootScope.loaded = true;
		}
		var args = {post: post, event: $event, rootScope: $rootScope, scope: $scope};
		modeService[$scope.mode].click(args);
	}

	var load = modeService[$scope.mode].load;
	if (load) load({ scope: $scope, rootScope: $rootScope, route: location.pathname });

	//$scope.$on("$locationChangeSuccess", function() { });

	$scope.getClass = function getClass(post, subpageIndex) {
		var getClass = modeService[$scope.mode].getClass;
		return getClass ? getClass({post: post, sIndex: subpageIndex, scope: $scope}) : "";
	}

	$scope.submit = function submit(post, subpage, subpageIndex, $event) {
		modeService[$scope.mode].submit({
			post: post, 
			subpage: subpage, 
			sIndex: subpageIndex, 
			scope: $scope, 
			event: $event
		});
	}

	$scope.msgToUser = "";

        // Each post uses this function to find out if it should be a textarea or not.
        $scope.isEditable = function isEditable(post) {
		if ($scope.mode === "edit")
                	return modeService[$scope.mode].isEditable(post);
		else return false;
        }

	$scope.getRoute = function getRoute(post, subpage, subpageIndex) {
		var getRoute = modeService[$scope.mode].getRoute;
		return getRoute ? getRoute({post: post, subpage: subpage, sIndex: subpageIndex, scope: $scope, rootScope: $rootScope}) : "";
	}

}]);
