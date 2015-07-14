"use strict";
angular.module("swen").run(["modeService", "$meteor", "$location", 
	function addBrowse(modeService, $meteor, $location) { 
		function browse () {
			var oldIds = [];
			return {

// Letting all returned functions start at the left margin, for readability.

getClass: function getClass(args) {
	return args.post._id === args.scope.idsA[args.sIndex] ? "selected" : "";
},

// The args parameter for click() includes post, rootScope, scope, and maybe event.
click: function click(args) {
	
	// Record the subpage clicked? To determine class/size? 
	// But whatever can be done in load from url is better because it means
	// that a person borrowing a url from a friend gets similar results.

	// Could preload to rootScope but shouldn't modify dom yet because
	// the default click action (reloading scope) has not yet happened.
	// Defeating that would make the back button behavior harder to do.
}, // End of click

load: function load(args) {
	// Split the path into one or two parts.
	var panelDescription = args.route.split("/+");
	// Get the ids using path and an isomorphic function.
	args.scope.idsA = Iso.parsePath(panelDescription[0]);
	// Later, consider second half.

/*
	// Convert ids to an array of reactive docs from the db.
	args.scope.postsA = args.scope.idsA.map(function (id) {
		return $meteor.object(Posts, id);
	});
*/
	Meteor.call("getGenerations", args.scope.idsA, function(err, data) {
		if (err) throw err;
		args.scope.subpagesA = data;
		args.rootScope.panelA = args.rootScope.panelA || [{}];
		// Look at the focus post for each generation.
		// Load each subpage with its generation's pack (near siblings).
		for (var i in args.scope.subpagesA) {
			args.rootScope.panelA[i] = $meteor.collection(function() {
				var subpage = args.scope.subpagesA[i];
				var thePost = subpage? subpage.post : "";
				var thePack = thePost? thePost.pack : "";
				return Posts.find(
					{ pack: thePack },
					// Sort them by their negative ranks.
					{ sort: { rank: -1 }}
				) || [{text: ""}];
			}); // End of giving each subpage a reactive collection.
		} // End of looping through the focus posts for each generation.
		var postA = args.rootScope.panelA[0][0];
		if (! oldIds.length && postA) oldIds.push({
			pack: postA.pack,
			focus: args.scope.idsA[0]
		});
		if (postA && oldIds[0].focus !== args.scope.idsA[0]) {
			oldIds.unshift({
				pack: postA.pack, 
				focus: args.scope.idsA[0]
			});
		}
		if (JSON.stringify(oldIds[0]) === JSON.stringify(oldIds[2])) {
			// A form of back navigation.
			oldIds = oldIds.slice(2);
		}
	}); // End of getGenerations.

}, // End of load function
/*
CASE 1:
THE FIRST PART OF URL IS ALREADY THE FOCUS OF PANELA[0]
(0 stays small, 1 stays big with highligh, 2 stays big with no highlight)
if e.g. we're only modifying panel1[1] and panel1[2], which is the case if the click is from panelA[1]; 
CASE 2:
THE FIRST PART OF THE NEW URL IS SECOND PART OF THE OLD URL
And if the click is from panelA[2], I want to delete or ng-hide panelA[0] and add another at the end of the array, which may make it easy to animate the whole process. 
CASE 3:
THERE IS JUST ONE IN THE URL
(0 stays big with highlight, 1 stays big no highlight, small or no 2)
if the click is in panelA[0] then both are changed instantly I believe.
CASE 4:
THERE ARE THREE IN THE URL
this means after browsing in 1, 0 was clicked, so a little reversal
-1>0 small, 0small>1big, 1big>2big with highlight 

// These cases do not include those that are due to e.g. tabbing through subpage2?

I NEED A WAY OF DETERMINING THE SIZE OF THE BOXES
*/


getRoute: function getRoute(args) {
	// This is called by every displayed post to determine its href.
	// The args param includes post and sIndex for subpageIndex
		var 	thisId = args.post._id, 
			subpages = args.scope.subpagesA || [{},{}], 
			higher = args.sIndex - 1,
			subpage = subpages[higher]? subpages[higher] : {},
			parent = subpage.post? subpage.post : {},
			parentId = parent._id || ""
		if (! parentId && 
			oldIds.length && 
			oldIds[0].pack !== args.post.pack &&
			oldIds[1].pack !== args.post.pack) {
			parentId = oldIds[0].focus;
		}
		if (parentId) return "/" + parentId + "/" + thisId;
		else return "/" + thisId;
}


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
