// /isomorphic/checkSlug.js
Meteor.methods({
  checkSlug: function checkSlug(args) {
    // This method checks database for existent ids and suggests alternates.
    // For example, if demo user suggests slug "example" and demo:example is in db,
    // the suggestion should be demo:example--1.
    // And if demo:example--1 is already there, 
    // the suggestion should be demo:example--2.
    "use strict";
    if (! args.formattedSlug || ! args.poster) throw new Error("Input not found.");
    var slug = args.formattedSlug,
        poster = args.poster,
        idealId = poster + ":" + slug,
        startsWithId = new RegExp("^" + idealId + "(--.+)*$"),
        existent = Posts.find({ _id: startsWithId }),
        message = args.msgToUser || "",
        count;
    if (existent) {
      count = existent.count();
      if (count) {
        message += "'" + slug + "' has been used (times " + count + ") by " + poster + ".\n";
        message += "So an alternate address is offered.\n";
        return {
          suggestedSlug: slug + "--" + count,
          msgToUser: message 
        }
      }
      else {
        return {
          // Return unchanged slug and unchanged message.
          suggestedSlug: slug,
          msgToUser: message
        }
      }
    }
  }
});
