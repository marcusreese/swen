"use strict";
angular.module("swen").run(["modeService", "$timeout", "$location", "$rootScope", "$state",
  function addEdit(modeService, $timeout, $location, $rootScope, $state) {
    function edit() { 
      var memo = {}, thisUser = "demo", returnable;
      $rootScope.header = {
        tools: {
          edit: {
            //iconClass: "pencil",
            //buttonClass: "tool"
          }
        }
      };
      returnable = {

// Letting all returned functions start at the left margin, for readability.


child: function child(args) {
  args.scope.hideHint("childButton");
  // Conclude one update/insert and then begin update/insert of first child.
  var isInsert = $location.search().edit !== "update-focus-post";
  if (isInsert) {
    // Concluding an insert.
    if (args.scope.draft.text) {
      args.formType = $location.search().edit;
      Iso.insert(args);
    }
    // If there's no text, cannot create a child of nothing.
    else clearForm(args);
  }
  else {
    // Concluding an update.
    update(args);
  }
  openChildForm(args);
},

click: function click(args) {
  args.scope.hideHint("clickInEditMode");
},

clickOut: function clickOut(args) {
  var id = args.event.target.id;
  if (id==="wrapper" || id==="header") clearForm(args);
},

contentChange: function contentChange(args) {
  // There was a change in the textarea, so use the new text.
  var text = args.scope.draft.text;
  // Temporarily avoiding breaking up long stuff.
  if (text.length > 200) {
    args.scope.showHint("Large inputs are not yet supported.\nPlease enter up to one sentence and then click a button.");
    args.scope.draft.text = text.slice(0,300);
  }
  // Generate link suggestions and a url if this is an insert.
  if (! $location.search().edit || $location.search().edit === "update-focus-post") return;
  if (! text) {
    args.scope.draft.id = ""; 
    return;
  }
  args.formattedSlug = Iso.draftSlug(args);
  Meteor.call(
    "checkSlug", 
    // The current args may cause stack overflow when
    // Meteor uses EJSON.clone on the args.
    {
      formattedSlug: args.formattedSlug,
      poster: args.poster || "demo", //temp
    },
    function (err, data) {
      if (err) throw err;
      //memo.slugChangedBySystem = true;
      args.scope.draft.id = data.suggestedSlug;
      args.scope.$apply();
    }
  );

  // If the end of the text is a newline, shift focus down.
  
},

load: function load(args) {
  // Give modeService.browse something to put on each href.
  args.scope.queryString = "edit=update-focus-post";
  // At this point, browse.load needs to run,
  // especially to ensure focus post is in middle subpage,
  // and browse.load uses an async call, so give it a callback.
  args.callback = loadForms;
  modeService.browse.load(args);      
},

reset: function reset() {
  Meteor.call("reset", function(err, data) {
    $location.path("/").search("");
  });
},

save: function save(args) {
  args.scope.hideHint("save");
  // Conclude an update/insert and do not start another.
  var isUpdate = $location.search().edit === "update-focus-post";
  if (isUpdate) {
    update(args);
  }
  else if (args.scope.draft.text) {
    args.formType = $location.search().edit;
    Iso.insert(args);
  }
  //else
    // Inserting blank? Maybe user meant, "I'm done editing."
    // 
  clearForm(args);
},

sibling: function sibling(args) {
  args.scope.hideHint("continueButton");
  // Conclude one update/insert and then begin update/insert of next sibling.
  var isInsert = $location.search().edit !== "update-focus-post";
  if (isInsert) {
    // Concluding an insert.
    // If there's text, post it and try inserting a new post.
    if (args.scope.draft.text) {
      args.formType = $location.search().edit;
      Iso.insert(args);
      $location.path(Iso.idsToRoute(
        args.scope.fociInA[0]._id,
        args.newPost._id 
      )).search("edit", "draft-next-sibling");
    }
    else {
      // No text, so try updating next sibling
      // Cases: firstsib(noparent), firstchild(nosib), lastCh, nextSib.
      var postA = args.scope.fociInA[0],
          postB = args.scope.fociInA[1],
          keyA = "_id",
          keyB = "_id";
      //if ($location.search().edit === "draft-first-sibling")
      if ($location.search().edit === "draft-next-sibling") {
        keyB = "next";
      }
      //else if ($location.search().edit === "draft-first-child") 
      else if ($location.search().edit === "draft-last-child") {
        postB = postA;
        keyB = "childZ";
      }
      $location.path(Iso.idsToRoute(
        postA[keyA],
        postB[keyB] 
      )).search("edit", "update-focus-post");
      //nextUpdatable(args);
    }
  }
  else {
    // Concluding an update.
    update(args);
    // If the focus post was deleted, try to find another.
    var focus1 = args.newFocusId ? args.newFocusId : args.scope.fociInA[1]._id;
    $location.path(Iso.idsToRoute(
      args.scope.fociInA[0]._id,
      focus1
    )).search("edit", "draft-next-sibling");
    //nextInsertable(args);
  }
},

slugChange: function slugChange(args) {
  args.scope.hideHint("slugChange");
  // If the user is manually suggesting a slug, check it and respond.
  /*
  if (memo.slugChangedBySystem) {
    memo.slugChangedBySystem = false;
    return;
  }
  */
  args.roughSlug = args.scope.draft.id;
  Iso.formatSlug(args);
  Meteor.call(
    "checkSlug", 
    // The current args may cause stack overflow when
    // Meteor uses EJSON.clone on the args.
    {
      formattedSlug: args.formattedSlug,
      poster: args.poster,
      msgToUser:  args.msgToUser
    },
    function (err, data) {
      if (err) throw err;
      //memo.slugChangedBySystem = true;
      args.scope.draft.id = data.suggestedSlug;
      if (data.msgToUser) args.scope.showHint(data.msgToUser);
      args.scope.$apply();
    }
  );
},

updateTool: function updateTool(args) {
  // Make it ready to clearForm().
  args.scope.display[1]["-firstForm"] = 
    args.scope.display[1]["-firstForm"] || {};
  // Make the tool togglable.
  if (args.scope.mode === "edit") {
    clearForm(args);
    return;
  }
  //args.rootScope.header.tools.edit.buttonClass += " active";
  $location.search("edit", "update-focus-post");
}


// That's all the returned functions, so leaving left margin again.

      }; // End of returnable block

      // Helper functions

      function clearForm(args) {
        if ($location.search().edit === "draft-first-child"
          // User is giving up on a first child draft.
          // There may not be siblings, but the parent has been the focus.
          || (args.deleted && ! args.newFocusId)) {
          // A post was deleted and no sibling was found to take its place.
          // So go back to the parent and any grandparent.
          var route = args.scope.display[0][args.scope.fociInA[0]._id].route;
          route = route.split("?")[0];
          $location.search("");
          $location.path(route); 
        }
        else if (args.newPost) {
          // User has clicked Save, and it wasn't just an update.
          // So navigate to a never-before-used route.
          $location.path(Iso.idsToRoute(
            args.scope.fociInA[0]._id,
            args.newPost._id
          )).search("");
        }
        else if (args.newFocusId) {
          // User has deleted focus post in subpage1.
          $location.path(Iso.idsToRoute(
            args.scope.fociInA[0]._id,
            args.newFocusId
          )).search("");
        }  
        else {
          // User wants to stay at current location, just stop editing.
          // So simply remove the query string from the url.
          $location.search("");
          $state.reload();
        }
      }

      function isFocus(id) {
        var route = location.pathname.split("/"),
            focusId = route[1] + route[route.length-1];
        return id === focusId;
      }

      function openChildForm(args) {
        $location.path(Iso.idsToRoute(
          args.newPost ? args.newPost._id : args.post._id,
          "-" 
        )).search("edit", "draft-first-child");
      }

      function loadForms(args) {

        if (! args.scope.fociInA)
          // This will be rerun after the data comes in.
          return;
        var editable = Posts.findOne({ _id: args.scope.fociInA[1]._id });
        args.scope.poster = thisUser;
        args.scope.display[1]["-firstForm"] = {};
        if ($location.search().edit === "update-focus-post") {
          // Define the poster on the form.
          args.scope.poster = editable._id.split(":")[0];
          // Display the form.
          args.scope.display[1][editable._id].isFormShowable = true;
          // Hide the text above the form.
          args.scope.display[1][editable._id].isEditable = true;
          // Show the text within the form.
          args.scope.draft.text = editable.text;
          // Show the existing route within the form.
          args.scope.draft.id = editable._id.split(":")[1];
        }
        else if ($location.search().edit === "draft-first-child") {
          args.scope.display[1]["-firstForm"].isFormShowable = true;
        }
        else if ($location.search().edit === "draft-next-sibling") {
          args.scope.display[1][editable._id].isFormShowable = true;
        }
        else if ($location.search().edit === "draft-first-sibling") {
          args.scope.display[1]["-firstForm"].isFormShowable = true;
          // There are no children of a blank form, so show none.
          args.rootScope.panelA[2] = [];
          // And stop highlighting the now previous post.
          args.scope.display[1][editable._id].linkClass = "";
        }
        else if ($location.search().edit === "draft-last-child") {
          console.log("ready to implement draft-last-child");
        }
        // Focus the new textarea.
        $timeout(function setFocus() {
          // Hide the text above the form.
          editable = {_id: args.scope.idsA[1]};
          // Panel 0, subpage 1, etc.
          var domId;
          if ($location.search().edit === "draft-first-child")
            // Temporarily working id:
            domId = "0_1__textarea";
          else domId = "0_1_" + editable._id + "_textarea";
          if (document.getElementById(domId))
            document.getElementById(domId).focus();
        });
      }

/*
      function nextInsertable(args) {
        // This was update or successful insert, so allow new insert.
        // Display what's been in the form above the form now.
        var editable = args.scope.fociInA[1];
        args.scope.display[1][editable._id].isEditable = false;
        // There are no children of a blank form, so show none.
        args.scope.temp = JSON.stringify(args.rootScope.panelA[2]);
        args.rootScope.panelA[2] = [];
        // And stop highlighting the now previous post.
        args.scope.display[1][editable._id].linkClass = "";
        // Take the text out of the form.
        args.scope.draft.text = "";
        args.scope.draft.id = "";
      }
      function nextUpdatable(args) {
        // Continue from blank insert form, so make next sibling editable.
        // Cases: firstsib(noparent), firstchild(nosib), lastCh, nextSib.
        // If no post, this is a draft-first-sibling 
        var nextId = args.post ? args.post.next : args.scope.fociInA[0].childA;
        if (nextId === "-") {
          // This is first child form.
          // Move to the first existing child.
          $location.path(Iso.idsToRoute(
            args.scope.fociInA[0]._id, 
            args.scope.fociInA[1]._id 
          )).search("edit", "update-focus-post");
        }
        else if (nextId) {
          if (nextId[0] === "-") nextId = nextId.slice(1);
          //args.rootScope.form = "update-focus-post";
          var route = "";
          if (args.scope.display[1][nextId])
            route = args.scope.display[1][nextId].route;
          else
            route = location.pathname.split("/-").join("/");
          $location.path(route);
        }
        else {
          // But if there is no next sibling, try insert before first.
          //args.rootScope.form = "draft-first-sibling";
          var route = args.scope.display[1][args.post.pack].route.split("/"),
              last = route.pop();
          last = "-" + last;
          route = route.concat(last).join("/");
          $location.path(route);
        }
      }
*/
      function update(args) {
        if (args.scope.draft.text) {
          // Take text from textarea.
          args.post.text = args.scope.draft.text;
          //before: args.scope.panelA[args.sIndex].save(args.post);
          args.subpage.save(args.post);
        }
        else {
          // If no children, delete post.
          if (! args.post.childA) {
            Iso.deleteOne(args);
            //args.subpage.remove(args.post);
            // Notify user.
            args.scope.showHint("Note deleted.");
          }
          else {
            // Notify user.
            args.scope.showHint("Cannot delete a note with child notes (yet).");
            // Clear form.
            clearForm(args);
          } // End else children exist
        } // End else no text
      }


      return returnable;
    } // End of edit function
          modeService.addMode("Edit", edit());
  } // End of addEdit function
]); // End of run function


