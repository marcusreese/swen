"use strict";
angular.module("swen").run(["modeService", "$timeout",
  function addEdit(modeService, $timeout) {
    function edit() { 
      var editable = {},
          returnable = {

// Letting all returned functions start at the left margin, for readability.

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

click: function click(args) {
  // The scope's mode is already "edit" or we wouldn't be here,
  // but modeService probably doesn't know it yet, and it needs to know
  // because scope.mode is about to be erased when event default happens.
  modeService.setCurrentMode('edit');
},

load: function load(args) {
  // Before this edit.load, browse.load needs to run,
  // especially to ensure focus post is in middle subpage,
  // and browse.load uses an async call, so give it a callback.
  args.callback = makePostEditable;
  modeService.browse.load(args);      
  // Now define what runs after browse.load:
  function makePostEditable(args) {
    // Hide the text above the form.
    editable = args.scope.fociInA[1].post;
    // Show the text within the form.
    args.scope.draft.text = editable.text;
    // Show the existing route within the form.
    args.scope.draft.id = editable._id;
    // Focus the new textarea.
    $timeout(function setFocus() {
      // Panel 0, subpage 1, etc.
      var domId = "0_1_" + editable._id + "_textarea";
      document.getElementById(domId).focus();
    });
  }
},

sibling: function sibling(args) {
  // Conclude one update/insert and then begin update/insert of next sibling.
  var isInsert = args.post ? args.post.isSpawning : args.subpage.isPosting;
  if (isInsert) {
    // Concluding an insert.
    if (args.post) {
      args.insertAs = "nextSibling";
      // The isSpawning flag was temporary.
      delete args.post.isSpawning;
    }
    else {
      args.insertAs = "firstSibling";
      // The isPosting flag was temporary.
      delete args.subpage.isPosting;
    }
    // If there's text, post it and try inserting a new post.
    if (args.scope.draft.text) {
      Iso.insert(args);
      nextInsertable(args);
    }
    // But if no text, try updating next sibling
    else nextUpdatable(args);
  }
  else {
    // Concluding an update.
    update(args);
    args.insertAs = "nextSibling";
    nextInsertable(args);
  }
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
  insertFirstChild(args);
},

cancel: function cancel(args) {
  editable = {};
  if (args.post) delete args.post.isSpawning;
  else delete args.subpage.isSpawning;
}


// That's all the returned functions, so leaving left margin again.

      }; // End of returnable block

      // Helper functions

      function insertFirstChild(args) {
        var newSubpage = args.rootScope.panelA[args.subpageIndex + 1];
        newSubpage.isPosting = true;
        editable = {};
      }

      function update(args) {
        // Take text from textarea. (TODO: Remove post if blank.)
        args.post.text = args.scope.draft.text || args.post.text;
        //before: args.scope.panelA[args.sIndex].save(args.post);
        args.subpage.save(args.post);
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

      function nextInsertable(args) {
        // This was update or successful insert, so allow new insert.
        args.post.isSpawning = true;
        args.scope.draft.text = "";
        args.scope.draft.id = "";
        editable = {};
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
