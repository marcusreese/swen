"use strict";
var app = angular.module("swen");
app.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
        function($urlRouterProvider, $stateProvider, $locationProvider){

		// https://github.com/Urigo/angular-meteor/issues/343 says do this:
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

                $stateProvider
                        .state("root", {
                                url: "/",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 1a (username)", {
                                url: "/:username1",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 1b (first instance of slug)", {
                                url: "/:username1/:slug1",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 1c (slug differentiator)", {
                                url: "/:username1/:slug1/:differentiator1",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 2a", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 2b", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 2c", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 3a", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2/+/:username3",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 3b", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2/+/:username3/:slug3",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 3c", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2/+/:username3/:slug3/:differentiator3",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })

                        .state("to 4a", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2/+/:username3/:slug3/:differentiator3/+/:username4",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 4b", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2/+/:username3/:slug3/:differentiator3/+/:username4/:slug4",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 4c", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2/+/:username3/:slug3/:differentiator3/+/:username4/:slug4/:differentiator4",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 5a", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2/+/:username3/:slug3/:differentiator3/+/:username4/:slug4/:differentiator4/+/:username5",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 5b", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2/+/:username3/:slug3/:differentiator3/+/:username4/:slug4/:differentiator4/+/:username5/:slug5",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 5c", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2/+/:username3/:slug3/:differentiator3/+/:username4/:slug4/:differentiator4/+/:username5/:slug5/:differentiator5",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 6a", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2/+/:username3/:slug3/:differentiator3/+/:username4/:slug4/:differentiator4/+/:username5/:slug5/:differentiator5/+/:username6",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 6b", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2/+/:username3/:slug3/:differentiator3/+/:username4/:slug4/:differentiator4/+/:username5/:slug5/:differentiator5/+/:username6/:slug6",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })
                        .state("to 6c", {
                                url: "/:username1/:slug1/:differentiator1/+/:username2/:slug2/:differentiator2/+/:username3/:slug3/:differentiator3/+/:username4/:slug4/:differentiator4/+/:username5/:slug5/:differentiator5/+/:username6/:slug6/:differentiator6",
                                templateUrl: "client/views/page.ng.html",
                                controller: "Controller"
                        })

                $urlRouterProvider.otherwise("/mjr/hey");
        }
]);

