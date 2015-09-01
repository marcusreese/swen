"use strict";
Meteor.startup(function () {
  if (Posts.find().count() === 0) {
    // For browse, index pack (alph) and then rank (highest first)
    Posts._ensureIndex({ pack: 1, rank: -1});
    // And for discovering direct parents, index child (oldest 1st)
    Posts._ensureIndex({ child: 1, when: 1 }, {sparse: true});
    Posts.insert({
      _id: "demo:welcome",
      text: "Welcome to this tool for keeping notes.",
      rank: -10,
      when: Date.now(),
      childA: "demo:in-progress",
      pack: "demo:welcome",
      next: "",
      //love: 0,
    });
    Posts.insert({
      _id: "demo:in-progress",
      text: "At the moment, this is just a demo of a work in progress.",
      rank: -10,
      when: Date.now(),
      parentA: "demo:welcome",
      childA: "",
      pack: "demo:in-progress",
      next: "demo:feel-free",
      //love: 0,
    });
    Posts.insert({
      _id: "demo:feel-free",
      text: "Feel free to add temporary content and edit it.",
      rank: -20,
      when: Date.now(),
      parentA: "demo:welcome",
      childA: "",
      pack: "demo:in-progress",
      next: "",
      //love: 0,
    });
  }
});
