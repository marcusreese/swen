// Renumber the posts in a pack and reset pack name if new leader.
Iso.repack = function renumber(args) {
  var i = 0,
    packLeader = "",
    prev = "",
    cursor = Posts.find({ pack: args.newPost.pack }, { sort: { rank: -1 } });
  cursor.forEach(function (obj) {
    // Keep count.
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
    if (prev) Posts.update({ _id: prev }, { $set: { next: obj._id }});
    // Replace previous post with this one.
    prev = obj._id;
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
