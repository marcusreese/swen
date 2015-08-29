"use strict";
angular.module("swen").run(["modeService", "$timeout", "$location", "$rootScope",
  function addEdit(modeService, $timeout, $location, $rootScope) {
    function edit() { 
      var memo = {}, returnable;
      $rootScope.header = {
        tools: {
          edit: {
            iconClass: "submit",
            buttonClass: "tool"
          }
        }
      };
      returnable = {

// Letting all returned functions start at the left margin, for readability.


child: function child(args) {
  args.scope.hideHint("childButton");
  // Conclude one update/insert and then begin update/insert of first child.
  var isInsert = args.rootScope.form ? args.rootScope.form !== "update" : false;
  if (isInsert) {
    // Concluding an insert.
    if (args.scope.draft.text) {
      Iso.insert(args);
    }
    // If there's no text, cannot create a child of nothing.
    else clear(args);
  }
  else {
    // Concluding an update.
    update(args);
  }
  openChildForm(args);
},

click: function click(args) {
  args.scope.hideHint("clickInEditMode");
  // The scope's mode is already "edit" or we wouldn't be here,
  // but modeService probably doesn't know it yet, and it needs to know
  // because scope.mode is about to be erased when event default happens.
  modeService.setCurrentMode("edit");
  if (args.post) {
    args.rootScope.form = "update";
    // Also, if a post is already the focus,
    // clicking it will not result in a load, so skip straight to
    // making it editable.
    if (location.href === args.event.target.href) {
      loadForms(args);
    }
  }
},

clickOut: function clickOut(args) {
  var id = args.event.target.id;
  if (id==="wrapper" || id==="header") clear(args);
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
  if (! args.scope.form || args.scope.form === "update") return;
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
      poster: args.poster || "demo2015", //temp
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
  var route = location.pathname;
  args.rootScope.header.tools.edit.buttonClass += " active";
  if (route.slice(-2) === "/-")
    args.scope.form = "firstChild";
  else if (route.slice(-3) === "/--")
    args.scope.form = "lastChild";
  else if (route.match(/\/-[a-z0-9A-Z]/))
    args.scope.form = "firstSibling";
  else if (route.slice(-1) === "-")
    args.scope.form = "nextSibling";
  else args.scope.form = "update";
  // Until this system is perfected, it's temporarily using rootScope.
  args.rootScope.form = args.scope.form;
  // At this point, browse.load needs to run,
  // especially to ensure focus post is in middle subpage,
  // and browse.load uses an async call, so give it a callback.
  args.callback = loadForms;
  modeService.browse.load(args);      
},

save: function save(args) {
  args.scope.hideHint("save");
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
  args.scope.hideHint("continueButton");
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
      poster: args.poster || "demo2015", //temp
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

tool: function tool(args) {
  // Make it ready to clear().
  args.scope.display[1]["-firstForm"] = 
    args.scope.display[1]["-firstForm"] || {};
  // Make the tool togglable.
  if (args.scope.mode === "edit") {
    clear(args);
    return;
  }
  // Temporarily it will edit first child.
  args.rootScope.header.tools.edit.buttonClass += " active";
  var parentRoute = args.scope.fociInA[0]._id.replace(/:/, ":/") + "/-";
  $location.path(parentRoute);  
}


// That's all the returned functions, so leaving left margin again.

      }; // End of returnable block

      // Helper functions

      function clear(args) {
        var editable = args.scope.fociInA[1];
        delete args.rootScope.form;
        modeService.setCurrentMode("browse");
        if (args.scope.idsA[1] === "-") {
          // New first child form has been up.
          // Whether draft saved or simply clicked out, this works.
          window.history.back();
        }
        else if (args.newPost) {
          var idParts = args.newPost._id.split(":");
          $location.path("/" + idParts[0] + ":/" + idParts[1]);
        }
        else {
          args.scope.display[1][editable._id].isFormShowable = false;
          args.scope.display[1][editable._id].isEditable = false;
          args.scope.display[1]["-firstForm"].isFormShowable = false;
          args.scope.mode = "browse";
          // Restore any deleted children of focus.
          if (! args.rootScope.panelA[2].length && args.scope.temp)
            args.rootScope.panelA[2] = JSON.parse(args.scope.temp);
          args.scope.temp = "";
          // Restore highlighting.
          args.scope.display[1][editable._id].linkClass = "selected";
          // Restore tool.
          args.rootScope.header.tools.edit.buttonClass = "tool";
          
        }
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
        args.rootScope.form = "firstChild";
        $location.path("/" + idParts[0] + ":/" + idParts[1] + "/-");
      }

      function loadForms(args) {
        if (! args.scope.fociInA)
          // This will be rerun after the data comes in.
          return;
        var editable = Posts.findOne({ _id: args.scope.fociInA[1]._id });
        args.scope.display[1]["-firstForm"] = {};
        if (args.rootScope.form === "update") {
          // Display the form
          args.scope.display[1][editable._id].isFormShowable = true;
          // Hide the text above the form.
          args.scope.display[1][editable._id].isEditable = true;
          // Show the text within the form.
          args.scope.draft.text = editable.text;
          // Show the existing route within the form.
          args.scope.draft.id = editable._id.split(":")[1];
        }
        else if (args.rootScope.form === "firstChild") {
          args.scope.display[1]["-firstForm"].isFormShowable = true;
        }
        else if (args.rootScope.form === "nextSibling") {
          args.scope.display[1][editable._id].isFormShowable = true;
        }
        else if (args.rootScope.form === "firstSibling") {
          args.scope.display[1]["-firstForm"].isFormShowable = true;
          // There are no children of a blank form, so show none.
          args.rootScope.panelA[2] = [];
          // And stop highlighting the now previous post.
          args.scope.display[1][editable._id].linkClass = "";
        }
        else if (args.rootScope.form === "lastChild") {
          console.log("ready to implement lastChild");
        }
        // Focus the new textarea.
        $timeout(function setFocus() {
          // Hide the text above the form.
          editable = {_id: args.scope.idsA[1]};
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
        // The insert form was blank, so make next sibling editable.
        var route = "";
        // If no post, this is a firstSibling form marked by "-" in url.
        var nextId = args.post ? args.post.next : args.scope.idsA.pop();
        if (nextId === "-") {
          // This is first child form.
          // Move to the first existing child.
          route = Iso.idsToRoute(
            args.scope.fociInA[0]._id, 
            args.scope.fociInA[1]._id
          );
          args.rootScope.form = "update";
          $location.path(route);
        }
        else if (nextId) {
          if (nextId[0] === "-") nextId = nextId.slice(1);
          args.rootScope.form = "update";
          var route = "";
          if (args.scope.display[1][nextId])
            route = args.scope.display[1][nextId].route;
          else
            route = location.pathname.split("/-").join("/");
          $location.path(route);
        }
        else {
          // But if there is no next sibling, try insert before first.
          args.rootScope.form = "firstSibling";
          var route = args.scope.display[1][args.post.pack].route.split("/"),
              last = route.pop();
          last = "-" + last;
          route = route.concat(last).join("/");
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


