"use strict";
var app = angular.module("swen");
app.controller("RedirectCtrl", ["$location", function($location){
	$location.path("/mjr:welcome");
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
			resolve: {
                                'subscribe': [
                                        '$meteor', function($meteor) {
                                                return $meteor.subscribe('postEtc', location.pathname);
                                        }
                                ]
                        },
			url: "/:segmentA0/:segmentA1/:segmentA2/:plusSign/:segmentB0/:segmentB1/:segmentB2",
			params: {
				segmentA0: {
					// We'll create default values elsewhere.
					// E.g. in fastrender, etc?
					value: null,
					squash: true
				},
				segmentA1: {
					value: null,
					squash: true
				},
				segmentA2: {
					value: null,
					squash: true
				},
				plusSign: {
					value: null,
					squash: true
				},
				segmentB0: {
					value: null,
					squash: true
				},
				segmentB1: {
					value: null,
					squash: true
				},
				segmentB2: {
					value: null,
					squash: true
				},
			}
		}) // End of normal state
/*
		.state("normal", {
			url: "/{username1}/{slug1}/{number1}/{and1}/{username2}/{slug2}/{number2}/{and2}/{username3}/{slug3}/{number3}/{and3}/{username4}/{slug4}/{number4}/{and4}/{username5}/{slug5}/{number5}/{and5}/{username6}/{slug6}/{number6}",
			templateUrl: "client/views/page.ng.html",
			controller: "Controller",
			resolve: {
				'subscribe': [
					'$meteor', function($meteor) {
						return $meteor.subscribe('postsInContext', location.pathname.slice(1));
					}
				]
			},
			params: {
				username1: {
					value: null,
					squash: true
				},
				slug1: {
					value: null,
					squash: true
				},
				number1: {
					value: null,
					squash: true
				},
				and1: {
					value: null,
					squash: true
				},
				username2: {
					value: null,
					squash: true
				},
				slug2: {
					value: null,
					squash: true
				},
				number2: {
					value: null,
					squash: true
				},
				and2: {
					value: null,
					squash: true
				},
				username3: {
					value: null,
					squash: true
				},
				slug3: {
					value: null,
					squash: true
				},
				number3: {
					value: null,
					squash: true
				},
				and3: {
					value: null,
					squash: true
				},
				username4: {
					value: null,
					squash: true
				},
				slug4: {
					value: null,
					squash: true
				},
				number4: {
					value: null,
					squash: true
				},
				and4: {
					value: null,
					squash: true
				},
				username5: {
					value: null,
					squash: true
				},
				slug5: {
					value: null,
					squash: true
				},
				number5: {
					value: null,
					squash: true
				},
				and5: {
					value: null,
					squash: true
				},
				username6: {
					value: null,
					squash: true
				},
				slug6: {
					value: null,
					squash: true
				},
				number6: {
					value: null,
					squash: true
				}
			}
		})
*/
		// The following seems to have no effect.
		//$urlRouterProvider.otherwise("/mjr/welcome");
        }
]);

