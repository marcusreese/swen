"use strict";
var app = angular.module("swen");
app.controller("RedirectCtrl", ["$location", function($location){
  $location.path("/demo:/welcome/in-progress");
}]);
app.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
        function($urlRouterProvider, $stateProvider, $locationProvider){
    // https://github.com/Urigo/angular-meteor/issues/343 says do this:
    $locationProvider.html5Mode({
      enabled: true,
      // Due to error messages in Karma:
      requireBase: false
    });
    $stateProvider
    .state("root", {
      url: "/",
      controller: "RedirectCtrl"
    })
    .state("normal", {
      controller: "Controller",
      templateUrl: "client/views/page.ng.html",
/*
 * The following seemed to slow us down at one point:
 *
      resolve: {
        'subscribe': [
          '$meteor', function($meteor) {
            return $meteor.subscribe('postEtc', location.pathname);
          }
        ]
      },
*/
      url: "/:segment0/:segment1/:segment2/:segment3/:segment4/:segment5/:segment6?edit",

      params: {
        segment0: {
          // We'll create default values elsewhere.
          // E.g. in fastrender, etc?
          value: null,
          squash: true
        },
        segment1: {
          value: null,
          squash: true
        },
        segment2: {
          value: null,
          squash: true
        },
        segment3: {
          value: null,
          squash: true
        },
        segment4: {
          value: null,
          squash: true
        },
        segment5: {
          value: null,
          squash: true
        },
        segment6: {
          value: null,
          squash: true
        },
      }
    }) // End of normal state
    // For the following to work, I need to define the exact
    // route here as a state (to join 'root' and 'normal').
    //$urlRouterProvider.otherwise("/demo:/search/?");
        }
]);

