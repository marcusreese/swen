// /isomorphic/insert.js
"use strict";
Iso.insert = function insert(args) {
  var 
    // This function inserts/posts a new post.
    newPost = {},

    // There are three locations in which to insert a post:
    // 1) as the next sibling after args.post
    // 2) as the first sibling in the pack of args.post
    // 3) as the first child of args.post
    nextSibling = args.formType === "draft-next-sibling",
    firstSibling = args.formType === "draft-first-sibling",
    firstChild = args.formType === "draft-first-child";

  // A post needs an id (_id for mongo).
  if (!args.scope.draft.id)
    throw new Error("Cannot insert without id.");
  newPost._id = args.scope.poster + ":" + args.scope.draft.id;

  // A post needs text.
  if (!args.scope.draft.text)
    throw new Error("Cannot insert without text.");
  newPost.text = args.scope.draft.text;
  
  // A post needs rank to determine order of appearance.
  // Ranks given here will be slightly adjusted during repack.
  // (Order will remain but spacing will be made more regular.)
  if (nextSibling) {
    // The new post comes after existing sibling post.
    // So it gets a more negative rank. (From -1 to -9 should work.)
    newPost.rank = args.post.rank - 1;
  }
  else {
    // This is at the beginning of a subpage. (So -1 to -9 should work.)
    newPost.rank = -1;
  }

  // A post needs a date of last modification.
  newPost.when = Date.now() || (new Date()).getTime();

  // A post needs a pack of siblings (for pagination).
  // The leader of the pack gives its name to the pack.
  if (nextSibling) {
    // The new post comes after spawning sibling post.
    // So it gets the same pack for now.
    newPost.pack = args.post.pack;
  }
  else if (firstSibling) {
    // The new post comes before spawning sibling post.
    // It gets old pack name for repack, where the pack is renamed.
    newPost.pack = args.subpage[0].pack; // or ._id
  }
  else if (firstChild) {
    // The new post is first child of spawning parent post.
    // So it's new pack is the parent's previous first child (until repack).
    // Or, if no child yet exists, this post's id will be it.
    if (args.scope.fociInA[1]._id) {
      newPost.pack = args.scope.fociInA[1]._id;
    }
    else {
      newPost.pack = newPost._id;
    }
  }
  else throw new Error("Insert location unclear");

  // A post needs a reference to its first parent.
  if (firstSibling || nextSibling) {
    // The new post gets the same parent as spawning sibling.
    newPost.parentA = args.post.parentA;
  }
  else if (firstChild) {
    // The new post is being spawned by its parent.
    newPost.parentA = args.scope.fociInA[0]._id;
  }
  else throw new Error("Insert location unclear");
  
  // A post needs a reference to its next sibling.
  if (nextSibling) {
    // The new post comes after its spawning sibling
    newPost.next = args.post.next;
    // The spawning sibling should be fixed during repack.
  }
  else if (firstSibling) {
    // The new post comes before the first sibling in the pack/subpage.
    newPost.next = args.subpage[0]._id;
  }
  else if (firstChild && args.scope.fociInA[0].childA) {
    // The new post comes before the first child of its parent.
    newPost.next = args.scope.fociInA[0].childA;
  }
  else if (firstChild) {
    // The new post is the only child, so there is no next sibling.
    newPost.next = "";
  }
  else throw new Error("Insert location unclear");

  // Eventually, a post may also get the following:
    //sibA: args.post.sibA,
    //childA, "",
    //love: 0,
    //readers: [],
    //writers: [],
    //executors: [],
    //prev: "", // only for pack leader
    //packSize: 0, // only for pack leader
  var result = Posts.insert(newPost);
  if (result === newPost._id) {
    args.newPost = newPost;
    if (newPost.parentA && (firstSibling || firstChild))
      Posts.update({ _id: newPost.parentA }, { $set: { childA: newPost._id }});
    Iso.repack(args);
  }
}
