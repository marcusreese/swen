"use strict";
angular.module("swen").run(["modeService", "$meteor", "$location", "$timeout",
  function addBrowse(modeService, $meteor, $location, $timeout) { 
    function browse () {
      $meteor.subscribe('postEtc', $location.$$path);
      var viewedParents = {},
          memo = {},
          returnable = {

// Letting all returned functions start at the left margin, for readability.

// The args parameter for click() includes post, rootScope, scope, and maybe event.
click: function click(args) {
  // Record mode before $scope.mode is erased.
  modeService.setCurrentMode("browse");
  
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

  // Create a place for scope variables for each displayed post.
  args.scope.display = {0: {}, 1: {}, 2: {}};
 
  // Get the parent's siblings, child's siblings, and grandchildren.
    var data = args.scope.fociInA = Iso.getFoci(args.scope.idsA);
    // Save child-parent relationship for a form of back navigation.
    if (data) viewedParents[data[1].pack] = data[0]._id;
    // Let angular base dom on rootScope to prevent flicker.
    args.rootScope.panelA = args.rootScope.panelA || [{}];
    // Look at the focus post for each generation.
    // Load each subpage with its generation's pack (near siblings).
    for (var subpageIndex in args.scope.fociInA) {
      var focusPost = args.scope.fociInA[subpageIndex],
          panel = args.rootScope.panelA,
          query = {};
      if (subpageIndex === "0")
        query._id = focusPost._id;
      else query.pack = focusPost.pack;
      panel[subpageIndex] = $meteor.collection(function() {
        // Load a reactive pack of siblings in the subpage.
        return Posts.find(
          query,
          // Sort them by their negative ranks.
          { sort: { rank: -1 }}
        ); // End of what's returned to $meteor.collection;
      }); // End of giving a subpage its reactive collection.
      // Loop through only the posts--not every i in panel[subpageIndex]
      for (var i = 0; i < panel[subpageIndex].length; i++) { 
        var post = panel[subpageIndex][i];
        // Build out the tree structure for view to use.
        if (! args.scope.display[subpageIndex][post._id])
          args.scope.display[subpageIndex][post._id] = {};
        var displayScope =  args.scope.display[subpageIndex][post._id];
        if (subpageIndex === "0")
          displayScope.linkClass = "parent";
        else if (subpageIndex === "1")
          displayScope.linkClass = post._id === focusPost._id ? "selected" : "unselected";
        else if (subpageIndex === "2") displayScope.linkClass = "child";
        displayScope.route = getRoute({
          post: post, 
          scope: args.scope, 
          sIndex: subpageIndex
        });
        (function presubOuter(route) {
          $timeout(function presubscribe() {
            $meteor.subscribe("postEtc", route);
          });
        })(displayScope.route);
      }
    } // End of looping through the focus posts for each generation.
    // Allow decorator modules to build on this load function.
    if (args.callback) args.callback(args);
    else if (! memo.userProgress) {
      args.scope.showHint("HINT: Select a lower sentence to see its comments.");
      memo.userProgress = 1;
    }
    else if (memo.userProgress === 1) {
      args.scope.showHint("You can keep clicking lower comments to go deeper.");
      memo.userProgress = 2;
    }
    else if (memo.userProgress === 2) {
      args.scope.showHint("You can also click a top sentence to go back.");
      memo.userProgress = 3;
    }
//  }); // End of getFoci call
} // End of load function

}; // End of returnable
      
// Start helper functions

function getRoute(args) {
  // The href should start with parent if possible, then post's id.
  // The args param includes post, scope and sIndex (subpageIndex).
  var   
    // Post's own id for last part of href route:
    thisId = args.post._id,
    // Parent id for middle part of href route:
    parentId = "";
  // Deal differently with hrefs in different subpages.
  // (sIndex is short for subpageIndex.)
  if (args.sIndex > 0) {
    parentId = args.scope.fociInA[args.sIndex - 1]._id || "";
  }
  else {
    // No parent on screen as this is is in first subpage,
    // so look for any recorded history of latest parent viewed.
    parentId = viewedParents[args.post.pack] || "";
  }
  // Add slashes between poster and slug to make url more conventional.
  var parentParts = parentId.split(":"),
    childParts = thisId.split(":"),
    parentSection = parentParts.join(":/"),
    childSection = childParts.join(":/"),
    route;
  // If the poster/author is the same, don't mention poster twice.
  if (parentParts[0] === childParts[0]) 
    childSection = childParts[1];
  if (parentId)
    route = "/" + parentSection + "/" + childSection;
  else
    route = "/" + childSection;
  if (args.scope.queryString) route += "?" + args.scope.queryString;
  return route;
}

      // That's all the functions, so leaving left margin again.
      return returnable;
    } // End of browse function
    // Make this the default mode.
    modeService.addMode("Browse", browse(), "default");
  } // End of addBrowse function.
]); // End of run function
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

