"use strict";
angular.module("swen").run(["modeService", "$timeout", "$location",
  function addEdit(modeService, $timeout, $location) {
    function edit() { 
      var editable = {},
          returnable = {

// Letting all returned functions start at the left margin, for readability.


child: function child(args) {
  // Conclude one update/insert and then begin update/insert of first child.
  var isInsert = args.rootScope.form ? args.rootScope.form !== "update" : false;
  if (isInsert) {
    // Concluding an insert.
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
  if (args.rootScope.form) modeService.setCurrentMode("edit");
  // If there is no post, the event is probably on outer blank space.
  // But it may be bubbling from an inner div, 
  // and stopPropagation is having strange effects (actually causing reload?)
  // So look at original target.
  // If class is page, the user may be trying to click out of a form,
  // because there is no cancel button at time of writing this comment.
  if ( args.event.target.className.slice(0,4) === "page" ) {
    args.post = {};
    args.subpage = {};
    clear(args);
  }
  else if (args.post) {
    //args.event.stopPropagation();
    // Wrap content in form.
    args.rootScope.form = "update";
    // Also, if a post is already the focus,
    // clicking it will not result in a load, so skip straight to
    // making it editable.
    if (location.href === args.event.target.href) {
      makeEditable(args);
    }
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

isShowable: function isShowable(args) {
  // Boolean determines if the insert/update form is shown.
  if (args.rootScope.form === "update")
    return args.post ? args.post._id === editable._id : false;
  else if (
    args.rootScope.form === "firstChild" &&
    ! args.post &&
    args.scope.idsA[1] === "-" &&
    args.index === 1
  )
    return true;
  else if (
    args.rootScope.form === "nextSibling" &&
    args.post &&
    isFocus(args.post._id)
  )
    return true;
  else if (
    args.rootScope.form === "firstSibling" &&
    ! args.post &&
    args.index === 1
  )
    return true;
},

load: function load(args) {
  // Before this edit.load, browse.load needs to run,
  // especially to ensure focus post is in middle subpage,
  // and browse.load uses an async call, so give it a callback.
  args.callback = makeEditable;
  modeService.browse.load(args);      
},

save: function save(args) {
  // Conclude an update/insert and do not start another.
  var isUpdate = args.rootScope.form === "update";
  if (isUpdate) {
    update(args);
  }
  else if (args.scope.draft.text) {
    Iso.insert(args);
  }
  //else
    // Inserting blank? Maybe user meant, "I'm done editing."
    // 
  clear(args);
},

sibling: function sibling(args) {
  // Conclude one update/insert and then begin update/insert of next sibling.
  var isInsert = args.rootScope.form ? args.rootScope.form !== "update" : false;
  if (isInsert) {
    // Concluding an insert.
    // If there's text, post it and try inserting a new post.
    if (args.scope.draft.text) {
      Iso.insert(args);
      args.rootScope.form = "nextSibling";
      var idParts = args.newPost._id.split(":");
      $location.path("/" + idParts[0] + ":/" + idParts[1]);
    }
    // But if no text, try updating next sibling
    else {
      nextUpdatable(args);
    }
  }
  else {
    // Concluding an update.
    update(args);
    args.rootScope.form = "nextSibling";
    nextInsertable(args);
  }
}


// That's all the returned functions, so leaving left margin again.

      }; // End of returnable block

      // Helper functions

      function clear(args) {
        editable = {};
        delete args.rootScope.form;
        modeService.setCurrentMode("browse");
        if (args.scope.idsA[1] === "-") {
          var idParts = args.newPost._id.split(":");
          $location.path(location.pathname.slice(0,-1) + idParts[1]);
        }
        else if (args.newPost) {
          var idParts = args.newPost._id.split(":");
          $location.path("/" + idParts[0] + ":/" + idParts[1]);
        }
        else args.scope.mode = "browse";
      }

      function isFocus(id) {
        var route = location.pathname.split("/"),
            focusId = route[1] + route[route.length-1];
        return id === focusId;
      }

      function openChildForm(args) {
        var 
          parentId = args.newPost ? args.newPost._id : args.post._id,
          idParts = parentId.split(":");
        editable = {};
        args.rootScope.form = "firstChild";
        $location.path("/" + idParts[0] + ":/" + idParts[1] + "/-");
      }

      function makeEditable(args) {
        if (args.rootScope.form === "update") {
          // Hide the text above the form.
          editable = args.scope.fociInA[1];
          // Show the text within the form.
          args.scope.draft.text = editable.text;
          // Show the existing route within the form.
          args.scope.draft.id = editable._id.split(":")[1];
        }
        else if (args.rootScope.form === "firstChild") {
        }
        else if (args.rootScope.form === "nextSibling") {
        }
        else if (args.rootScope.form === "firstSibling") {
        }
        // Focus the new textarea.
        $timeout(function setFocus() {
          // Hide the text above the form.
          editable = editable._id ? editable : {_id: args.scope.idsA[1]};
          // Panel 0, subpage 1, etc.
          var domId;
          if (args.rootScope.form === "firstChild")
            // Temporarily working id:
            domId = "0___textarea";
          else domId = "0_1_" + editable._id + "_textarea";
          if (document.getElementById(domId))
            document.getElementById(domId).focus();
        });
      }

      function nextInsertable(args) {
        // This was update or successful insert, so allow new insert.
        args.rootScope.form = "nextSibling";
        args.scope.draft.text = "";
        args.scope.draft.id = "";
        editable = {};
      }

      function nextUpdatable(args) {
        // The insert form was blank, so make next sibling editable.
        var nextId = args.post ? args.post.next : args.scope.idsA.pop();
        if (nextId) {
          editable = nextId;
          args.rootScope.form = "update";
          var route = args.scope.routes[1][nextId];
          $location.path(route);
        }
        else {
          // But if there is no next sibling, try insert before first.
          args.rootScope.form = "firstSibling";
          var route = args.scope.routes[1][args.post.pack];
          $location.path(route);
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
