"use strict";
angular.module("swen").run(["modeService", "$meteor", "$stateParams", 
	function addBrowse(modeService, $meteor, $stateParams) { 
		function browse () {
			var focusPost = {};
			return {

// Letting all returned functions start at the left margin, for readability.

getClass: function getClass(post) {
	return post._id === focusPost._id ? "selected" : "";
},

// The args parameter for click() includes post, rootScope, scope, and maybe event.
click: function click(args) {
	// Record post as focus for e.g. getClass().
	if (! args.post._id) args.post._id = "mjr/welcome";
	focusPost = args.post;
	args.rootScope.focus = $meteor.object(Posts, args.post._id);
	var focus = args.rootScope.focus;
	args.rootScope.subpage = $meteor.collection(function() {
		return Posts.find(
			{first: focus.first}, 
			{sort: {rank: 1}}
		);
	});
} // End of click

// That's all the returned functions, so leaving left margin again.

                        } // End of return block
		} // End of browse function

		// Make this the default mode.
		modeService.addMode("Browse", browse(), "default");
	} // End of addBrowse function.
]); // End of run function
/*
                if ($stateParams.username1 = "karma") {
                        // Karma reruns my controller and changes username1 only, so change it back?
                        $stateParams.username1 = "mjr";
                }

*/
