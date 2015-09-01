// isomorphic/deleteOne.js
Iso.deleteOne = function deleteOne(args) {
  // Delete with no checks.
  "use strict";
  var pack = args.post.pack,
      parents = Posts.find({ childA: args.post._id });
  parents.forEach(function (parent) {
    if (parent.childA === args.post._id) {
      if (args.post.next) 
        Posts.update({ _id: parent._id }, {$set: {childA: args.post.next }});
      else Posts.update({ _id: parent._id }, {$unset: {childA: 1}});
    }
  });
  args.deleted = args.post;
  Posts.remove({ _id: args.post._id });
  Iso.repack(args);
}
