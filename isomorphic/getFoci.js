// /isomorphic/getFoci.js
"use strict";
Meteor.methods({
  getFoci: function getFoci(ids) {
    // Takes 1 or 2 ids returned from path (via Iso.parsePath).
    check(ids, Array);
    if (! ids[0]) throw new error("No ids.");
    // Returns an array holding 3 posts, one for each future subpage.
    var foci = [],
        // Work backward through ids.
        last = (ids[1] !== undefined) ? ids[1] : ids[0];
    // Start the middle subpage with what follows the 
    // third slash of the route if the third slash exists.
    if (last !== "-")
      foci[1] = Posts.findOne({ _id: last });
    // If there's another id, use it for the first subpage.
    if (ids.length > 1) foci[0] = Posts.findOne({ _id: ids[0] });
    // Id "-" in 3rd position means 2nd subpage has no focus post
    // But perhaps an insertion form in first place.
    if (foci[0] && last === "-") {
      if (foci[0].childA)
        // Try to fill the 2nd subpage with any children of first.
        foci[1] = Posts.findOne({ _id: foci[0].childA });
      // Or leave it blank if there are no children.
      else foci[1] = {};
    }
    // For the rest, wait for foci[1].
    if (foci[1]) {
      if (ids.length === 1) {
        // There was only one id, so no parent is found yet.
        // Try to use foci[1]'s first parent for first subpage.
        if (foci[1].parentA)
          foci[0] = Posts.findOne({ _id: foci[1].parentA });
        else // give up
          foci[0] = {};
      }
      // Try to use foci[1]'s first child for third and last subpage.
      if (foci[1].childA)
        foci[2] = Posts.findOne({ _id: foci[1].childA });
      else // give up
        foci[2] = {};
    }
    // Check that all needed values are present, and then return;
    if (foci[2] && foci[1] && foci[0]) return foci;
  } // End of getFoci definition
});
