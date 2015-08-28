"use strict"
var app = angular.module("swen");
app.controller("Controller", [  
  "$scope", 
  "$rootScope",
  "modeService",
  "$mdToast",
function($scope, $rootScope, modeService, $mdToast){

  //$scope.status = function() {console.log(JSON.stringify(Posts.find().fetch()));}; 

  $scope.mode = modeService.getCurrentMode();

  // Prepare a blank draft that can be prepared for the user.
  $scope.draft = {text: ""};
  
  $scope.change = function change(target, post) {
    // Look for a function like contentChange or slugChange.
    var change = modeService[$scope.mode][target + "Change"];
    if (change) change({ post: post, scope: $scope, rootScope: $rootScope });
  }

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

  $scope.clickOut = function clickOut($event) {
    var clickOut = modeService[$scope.mode].clickOut;
    if (clickOut) clickOut({scope: $scope, rootScope: $rootScope, event: $event});
  }

  $scope.tool = function tool($event, mode) {
    var tool = modeService[mode].tool;
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
  $scope.hideHint = function() {
    console.log('closing hint');
    $mdToast.hide();
  }

}]);
