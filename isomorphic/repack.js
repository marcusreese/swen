// Renumber the posts in a pack and reset pack name if new leader.
Iso.repack = function renumber(args) {
  var i = 0,
    packLeader = "",
    prev = "",
    pack = args.newPost ? args.newPost.pack : args.deleted.pack,
    cursor = Posts.find({ pack: pack }, { sort: { rank: -1 } });
  // Set new focusable if there is a sibling.
  // First try to give it the id of deleted's next.
  if (args.deleted && args.deleted.next) args.newFocusId = args.deleted.next;
  cursor.forEach(function (obj) {
    // In case deleted has no next, find the obj that has deleted as next.
    if (args.deleted
      && ! args.newFocusId
      && obj.next === args.deleted._id) {
      args.newFocusId = obj._id;
    }
    // Keep count of how many child posts, if it's useful.
    i++;
    if (obj.rank > 0) {
      console.log("voting not ready");
      return;
    }
    if (typeof obj.place === "string") {
      console.log("alph not ready");
      return;
    }
    // Set this post as next for previous post.
    if (prev && prev.next !== obj._id) 
      Posts.update({ _id: prev._id }, { $set: { next: obj._id }});
    else if (! prev && cursor.count() === 1) 
      // This is first, and second must be deleted; there is no next.
      Posts.update({ _id: obj._id }, { $unset: { next: 1 }});
    // Replace previous post with this one.
    prev = obj;
    // The first post is the pack leader.
    if (!packLeader) {
      packLeader = obj._id;
    }
    // Reset pack if there is a new leader.
    if (obj.pack !== packLeader) {
      Posts.update({ _id: obj._id }, { $set: { pack: packLeader } });
    }
    // Renumber for negative rank, leaving space for insertions.
    Posts.update({ _id: obj._id }, { $set: { rank: 0-(i*10) } });
  });
  // Use count?
  // var r = Posts.update({ _id: parentId }, { $set: { child_count: i }});
}
