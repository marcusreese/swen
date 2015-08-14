"use strict";
angular.module("swen").run(["modeService", "$timeout", "$location",
  function addEdit(modeService, $timeout, $location) {
    function edit() { 
      var editable = {},
          returnable = {

// Letting all returned functions start at the left margin, for readability.

cancel: function cancel(args) {
  editable = {};
  if (args.post) delete args.post.isSpawning;
  else delete args.subpage.isSpawning;
},

child: function child(args) {
  // Conclude one update/insert and then begin update/insert of first child.
  var isInsert = args.post ? args.post.isSpawning : args.subpage.isPosting;
  if (isInsert) {
    // Concluding an insert.
    // The isSpawning flag was temporary.
    if (args.post) delete args.post.isSpawning;
    else delete args.subpage.isPosting;
    // If there's text, post it.
    if (args.scope.draft.text) {
      Iso.insert(args);
    }
  }
  else {
    // Concluding an update.
    update(args);
  }
  openChildForm(args);
},

click: function click(args) {
  // The scope's mode is already "edit" or we wouldn't be here,
  // but modeService probably doesn't know it yet, and it needs to know
  // because scope.mode is about to be erased when event default happens.
  modeService.setCurrentMode("edit");
  // Also, if a post is already the focus,
  // clicking it will not result in a load, so skip straight to
  // making it editable.
  if (location.pathname === modeService.browse.getRoute(args)) {
      makeEditable(args);
  }
},

getClass: function getClass(args) {
  return modeService.browse.getClass(args);
},

getRoute: function getRoute(args) {
  return modeService.browse.getRoute(args);
},

isEditable: function isEditable(post) {
  // Boolean determines if the post is shown above the textarea.
  return post._id === editable._id;
},

isShowable: function isShowable(post, subpage) {
  // Boolean determines if the insert/update form is shown.
  var insert = post ? post.isSpawning : subpage.isPosting,
      update = post ? post._id === editable._id : false;
  return insert || update;
},

load: function load(args) {
  // Before this edit.load, browse.load needs to run,
  // especially to ensure focus post is in middle subpage,
  // and browse.load uses an async call, so give it a callback.
  args.callback = makeEditable;
  modeService.browse.load(args);      
},

sibling: function sibling(args) {
  // Conclude one update/insert and then begin update/insert of next sibling.
  var isInsert = args.post ? args.post.isSpawning : args.subpage.isPosting;
  if (isInsert) {
    // Concluding an insert.
    if (args.post) {
      // The isSpawning flag was temporary.
      delete args.post.isSpawning;
if (args.subpage.isPosting) console.log('oops better delete this too?');
    }
    else {
      // The isPosting flag was temporary.
      delete args.subpage.isPosting;
    }
    // If there's text, post it and try inserting a new post.
    if (args.scope.draft.text) {
      Iso.insert(args);
      args.rootScope.form = "nextSibling";
      $location.path(args.newPost._id);
    }
    // But if no text, try updating next sibling
    else nextUpdatable(args);
  }
  else {
    // Concluding an update.
    update(args);
  console.log("record nextSibling?");
    args.rootScope.form = "nextSibling";
    nextInsertable(args);
  }
}


// That's all the returned functions, so leaving left margin again.

      }; // End of returnable block

      // Helper functions

      function openChildForm(args) {
        /*
        var newSubpage = args.rootScope.panelA[args.subpageIndex + 1];
        newSubpage.isPosting = true;
        args.scope.draft.text = "";
        args.scope.draft.id = "";
  if (args.newPost) console.log("newPost._id",args.newPost._id);
  else
    console.log("post._id",args.post._id);
        */
        var 
          parentId = args.newPost ? args.newPost._id : args.post._id,
          idParts = parentId.split(":");
        editable = {};
        args.rootScope.form = "firstChild";
        $location.path("/" + idParts[0] + ":/" + idParts[1] + "/-");
      }

      function makeEditable(args) {
        if (! args.rootScope.form) {
          // Hide the text above the form.
          editable = args.scope.fociInA[1];
          // Show the text within the form.
          args.scope.draft.text = editable.text;
          // Show the existing route within the form.
          args.scope.draft.id = editable._id.split(":")[1];
        }
        else if (args.rootScope.form === "firstChild") {
          args.rootScope.panelA[1].isPosting = true;
        }
        else if (args.rootScope.form === "nextSibling") {
  console.log('code block used', args);
          args.post.isSpawning = true;
        }
        else if (args.rootScope.form === "firstSibling") {
  console.log('code block used');
          args.subpage.isPosting = true;
        }
        // Focus the new textarea.
        $timeout(function setFocus() {
          // Panel 0, subpage 1, etc.
          var domId;
          if (args.rootScope.form === "firstChild")
            // Temporarily working id:
            domId = "0___textarea";
          else domId = "0_1_" + editable._id + "_textarea";
          document.getElementById(domId).focus();
        });
      }

      function nextInsertable(args) {
  //used after update. console.log('code block used');
        // This was update or successful insert, so allow new insert.
        args.post.isSpawning = true;
        args.scope.draft.text = "";
        args.scope.draft.id = "";
        editable = {};
    console.log('could set focus here?');
      }

      function nextUpdatable(args) {
        // The insert form was blank, so make next sibling editable.
        if (args.post.next) {
          editable = args.post.next;
        }
        else {
          // But if there is no next sibling, try insert before first.
          args.subpage.isPosting = true;
        }
      }

      function update(args) {
        // Take text from textarea. (TODO: Remove post if blank.)
        args.post.text = args.scope.draft.text || args.post.text;
        //before: args.scope.panelA[args.sIndex].save(args.post);
        args.subpage.save(args.post);
      }


      return returnable;
    } // End of edit function
          modeService.addMode("Edit", edit());
  } // End of addEdit function
]); // End of run function

/*
// A little algorithm for temp avoiding breaking up long stuff.
if (input.length > 200) {
  msgToUser("large input not yet supported");
  input = input.slice(0,300);
}

// A little algorigthm for choosing a slug.
$scope.beforeBiggest = "";
$scope.biggest = "";
var newWord = "", beforeNew = "";
if (newWord.length > biggest.length) {
  $scope.biggest = newWord;
  $scope.beforeBiggest = beforeNew;
}
*/
