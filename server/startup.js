"use strict";
Meteor.startup(function () {
  if (Posts.find().count() === 0) {
    // For browse, index pack (alph) and then rank (highest first)
    Posts._ensureIndex({ pack: 1, rank: -1});
    // And for discovering direct parents, index child (oldest 1st)
    Posts._ensureIndex({ child: 1, when: 1 }, {sparse: true});
    Posts.insert({
      _id: "dw:welcome",
      text: "Welcome to this tool for keeping notes.",
      rank: -10,
      when: Date.now(),
      childA: "dw:work-in-progress",
      pack: "dw:welcome",
      next: "",
      //love: 0,
    });
    Posts.insert({
      _id: "dw:work-in-progress",
      text: "At the moment, this is just a demo of a work in progress.",
      rank: -10,
      when: Date.now(),
      parentA: "dw:welcome",
      childA: "",
      pack: "dw:work-in-progress",
      next: "dw:feel-free",
      //love: 0,
    });
    Posts.insert({
      _id: "dw:feel-free",
      text: "Feel free to add temporary content and edit it.",
      rank: -20,
      when: Date.now(),
      parentA: "dw:welcome",
      childA: "",
      pack: "dw:work-in-progress",
      next: "",
      //love: 0,
    });
  }
});
