"use strict";
angular.module("swen").run(["modeService", "$meteor", "$stateParams", 
	function addBrowse(modeService, $meteor, $stateParams) { 
		function browse () {
			var focus = {};
			return {

// Letting all returned functions start at the left margin, for readability.

getClass: function getClass(post) {
	return post._id === focus._id ? "selected" : "";
},

// The args parameter for click() includes post, scope, and maybe event.
click: function click(args) {
	// Record post as focus for e.g. getClass().
	focus = args.post;
console.log('focus.first:')
console.log(focus.first);
	if (focus.first) {
		// Load the post including its context (starting with first).
			args.scope.subpage = $meteor.collection(
				function () {
					return Posts.find(
						{first: focus.first}, 
						{sort: {rank: 1}}
					);
				}	
			); // End collection (load)

	}
	// But there's no first when entering from mere url, so . . .
	else {
		$meteor.call('getPost', focus._id).then(
			function(data){
				console.log('success in getFirst', data);
				if (data) {
					focus = data;
					// Try this again.
			args.scope.subpage = $meteor.collection(
				function () {
					return Posts.find(
						{first: focus.first}, 
						{sort: {rank: 1}}
					);
				}	
			); // End collection (load)
					//args.scope.click(args);
				}
			},
			function(err){
				console.log('failed', err);
			}
		);
	} // End of else
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
