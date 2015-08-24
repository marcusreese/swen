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

  $scope.click = function click(post, $event, subpageIndex) {
    if (! $event) {
      // Initial load
      $rootScope.loaded = true;
    }
    var args = {post: post, event: $event, rootScope: $rootScope, scope: $scope, subpageIndex: subpageIndex};
    modeService[$scope.mode].click(args);
  }

  var load = modeService[$scope.mode].load;
  if (load) load({ scope: $scope, rootScope: $rootScope, route: location.pathname });

  $scope.getClass = function getClass(post, subpageIndex) {
    var getClass = modeService[$scope.mode].getClass;
    return getClass ? getClass({post: post, sIndex: subpageIndex, scope: $scope}) : "";
  }

  $scope.button = function button(post, subpage, $event, subpageIndex, action) {
    modeService[$scope.mode][action]({
      post: post, 
      subpage: subpage, 
      scope: $scope, 
      event: $event,
      subpageIndex: subpageIndex,
      rootScope: $rootScope
    });
  }

  $scope.msgToUser = "";

  // Each post uses this function to find out if it should be a textarea or not (in edit mode).
  $scope.isEditable = function isEditable(post) {
    if ($scope.mode === "edit")
      return modeService[$scope.mode].isEditable(post);
    else return false;
  }
  
  // Each form uses this to find out if it should display or not.
  $scope.isShowable = function isShowable(post, subpage, index) {
    var isShowable = modeService[$scope.mode].isShowable;
    return isShowable ? isShowable({post: post, subpage: subpage, rootScope: $rootScope, scope: $scope, index: index}) : "";
  }

  // Each post uses this function to determine it's href.
  $scope.getRoute = function getRoute(post, subpage, subpageIndex) {
    // See if the current mode supports getRoute
    var getRoute = modeService[$scope.mode].getRoute;
    return getRoute ? getRoute({post: post, sIndex: subpageIndex, scope: $scope}) : "";
  }

}]);
