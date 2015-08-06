"use strict";
angular.module("swen").run(["modeService", "$meteor", "$location", 
  function addBrowse(modeService, $meteor, $location) { 
    function browse () {
      var viewedParents = {};
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

  // Save parent-child relationship for a form of back navigation.
  viewedParents[args.scope.idsA[1]] = args.scope.idsA[0];
  
  // Get the parent's siblings, child's siblings, and grandchildren.
  Meteor.call("getGenerations", args.scope.idsA, function(err, data) {
    if (err) throw err;
    args.scope.fociInA = data;
    args.rootScope.panelA = args.rootScope.panelA || [{}];
    // Look at the focus post for each generation.
    // Load each subpage with its generation's pack (near siblings).
    for (var i in args.scope.fociInA) {
      args.rootScope.panelA[i] = $meteor.collection(function() {
        var theSubpage = args.scope.fociInA[i],
            thePost = theSubpage? theSubpage.post : "",
            thePack = thePost? thePost.pack : "";
        // Load a reactive pack of siblings in the subpage.
        return Posts.find(
          { pack: thePack },
          // Sort them by their negative ranks.
          { sort: { rank: -1 }}
        ) || [{text: "placeholder"}];
      }); // End of giving each subpage a reactive collection.
    } // End of looping through the focus posts for each generation.
    // Allow decorator modules to build on this load function.
    if (args.callback) args.callback(args);
  }); // End of getGenerations.
}, // End of load function

getRoute: function getRoute(args) {
  // This is called by every displayed post to determine its href.
  // The href should start with parent if possible, then post's id.
  // The args param includes post, scope and sIndex (subpageIndex).
  var   
    // Post's own id for last part of route:
    thisId = args.post._id,
    parentId = "",
    routeIds = args.scope.idsA;
  if (args.sIndex === 1) {
    // In second subpage, so first part of current route is parent.
     parentId = routeIds[0];
   }
   else if (args.sIndex === 2) {
     // In third subpage, so second part of current route is parent.
     parentId = routeIds[1];
   }
  // If no parent on screen, this is is in first subpage,
  // so look for any recorded history of latest parent viewed.
  else {
    parentId = viewedParents[routeIds[0]];
  }
  // Normal case for route: post links to parent and self.
  if (parentId) {
    // First, abbreviate if possible (i.e., if poster is same both times).
    var parentParts = parentId.split(":"),
      childParts = thisId.split(":"),
      childId = thisId;
    // If the poster/author is the same, don't mention poster twice.
    if (parentParts[0] === childParts[0]) childId = childParts[1];
    return "/" + parentId + "/" + childId;
  }
  // If this is first subpage with no history, post just links to itself.
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

