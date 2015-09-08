"use strict"
var app = angular.module("swen");
app.controller("Controller", [  
  "$scope", 
  "$rootScope",
  "modeService",
  "$mdToast",
function($scope, $rootScope, modeService, $mdToast){

  //$scope.status = function() {console.log(JSON.stringify(Posts.find().fetch()));}; 

  $scope.reset = function reset() {
    modeService.edit.reset();
  }

  $scope.msgToUser = "";
  $rootScope.hints = $rootScope.hints || {};
  $scope.showHint = function(message) {
    if (! message) alert("no message");
    if ($rootScope.hints[message]) return;
    $rootScope.hints[message] = true;
    $mdToast.show(
      $mdToast.simple()
      .content(message)
      .position("bottom left right")
      .hideDelay(7000)
    );
  }
  $scope.hideHint = function(where) {
    $mdToast.hide();
  }

  $scope.mode = modeService.getCurrentMode();

  // Prepare a blank draft that can be prepared for the user.
  $scope.draft = {text: ""};
  
  $scope.change = function change(target, post) {
    // Look for a function like contentChange or slugChange.
    var change = modeService[$scope.mode][target + "Change"];
    if (change) change({ post: post, scope: $scope, rootScope: $rootScope });
  }

  $scope.click = function click(post, $event, subpageIndex) {
    var args = {post: post, event: $event, rootScope: $rootScope, scope: $scope, subpageIndex: subpageIndex};
    modeService[$scope.mode].click(args);
  }

  if (location.search)
    // Use the first query parameter as the mode.
    $scope.mode = location.search.slice(1).match(/^[^=]+/)[0];
  var load = modeService[$scope.mode] ? modeService[$scope.mode].load : "";
  if (load) load({ scope: $scope, rootScope: $rootScope, route: location.pathname });

  $scope.clickOut = function clickOut($event) {
    var clickOut = modeService[$scope.mode].clickOut;
    if (clickOut) clickOut({scope: $scope, rootScope: $rootScope, event: $event});
  }

  $scope.tool = function tool($event, mode, tool) {
    var tool = modeService[mode][tool + "Tool"];
    if (tool) tool({scope: $scope, rootScope: $rootScope, event: $event});
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

}]);
