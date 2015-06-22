
Posts = new Mongo.Collection("posts");

if (Meteor.isClient) {
var app = angular.module("swen",["angular-meteor", "ui.router"]);
app.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
	function($urlRouterProvider, $stateProvider, $locationProvider){

		$locationProvider.html5Mode(true);

		$stateProvider
			.state("root", {
				url: "/",
				templateUrl: "page.ng.html",
				controller: "PageCtrl"
			})
			.state("username", {
				url: "/:username",
				templateUrl: "page.ng.html",
				controller: "PageCtrl"
			})
			.state("first instance of slug", {
				url: "/:username/:slug",
				templateUrl: "page.ng.html",
				controller: "PageCtrl"
			})
			.state("differentiated slug", {
				url: "/:username/:slug/:differentiator",
				templateUrl: "index.ng.html",
				controller: "PageCtrl"
			})

		$urlRouterProvider.otherwise("/mjr/hey");
	}
]);
app.controller("PageCtrl", ["$scope", "$meteor", function($scope, $meteor){
	$scope.status = function() {console.log(JSON.stringify(Posts.find().fetch()));};
	$scope.mode = "browse";
	$scope.setMode = function setMode(mode) {
		$scope.mode = mode;
// this is not right. model sets. how do we follow open and closed pattern?
	}
	$scope.editable = "";
	$scope.toggleEditMode = function toggleEditMode() {
		$scope.editable = "";
	}
}]);
app.controller("SubpageCtrl", ["$scope", "$meteor", "$stateParams", function($scope, $meteor, $stateParams){
	$scope.subpage = $meteor.collection(function () {
		return Posts.find({}, {sort: {rank: 1}});
		//return Posts.find({_id: $stateParams.username + "/" + $stateParams.slug}, {sort: {rank: 1}});
	});
	$scope.upsert = function upsert(newText, post) {
		var doc = {_id: post._id, text: newText, rank: post.rank};
		$scope.subpage.save(doc);
		//$scope.newText = '';
		$scope.editable = "";;
	}
	$scope.click = function click(post) {
		if ($scope.editMode) {
			$scope.newText = post.text;
			$scope.editable = post._id;
		}
	}
	$scope.isEditable = function isEditable(post) {
		if ($scope.editMode && $scope.editable === post._id)
			return true;
		else return false;
	}
}]);


// I don't remember the details, but the following was used on 'End of Code'.
function runCode($scope) {
	var arr = $scope.lines;
	var code = "";
	// Don't use the newest or the "end..code" line.
	for (var i = arr.length -3; i > 0; i--) {
		// Only since the latest "code:".
		if (arr[i].text.match(/code:/i)) break;
		else code = arr[i].text + code;
	}
	if (code) {
console.log(code)
		bash(code);
	}
}

function log(error, result) {
	if (error) console.log('myError: ' + error);
	else console.log(result);
}
// The following is not for production, of course.
// It allows browser console to run arbitrary bash code on server.
bash = function(script) {
	Meteor.call('bash', script, log);
}

} // end Meteor.isClient
if (Meteor.isServer) {

  Meteor.startup(function () {
    if (Posts.find().count() === 0) {

      var posts = [{_id: 'mjr/hey', text: 'Hey', rank: 0}, {_id: 'mjr/world', text: 'world!', rank: 1}];

      for (var i = 0; i < posts.length; i++)
        Posts.insert(posts[i]);

    }
   });

var Future = Npm.require('fibers/future');
Meteor.methods({
	bash: function(script) {
		script = "cd /Users/marcusreese/Projects/swen/sweng/; " + script;
		var future = new Future();
		var exec = Npm.require('child_process').exec;
		exec(script, function(error, stdout, stderr) {
			var results = error ? error.toString() : stdout;
			future["return"](results)
		});
		return future.wait();
	}
});
} // end Meteor.isServer
