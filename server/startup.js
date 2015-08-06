"use strict";
Meteor.startup(function () {
  if (Posts.find().count() === 0) {

    var posts = [
      {
        _id: "mjr:welcome", 
        text: "Welcome", 
        rank: -10,
        when: Date.now(),
        //child: "",
        pack: "mjr:welcome",
        //prev: "",
        //next: "",
        //love: 0,
      }, 
      {
        _id: "mjr:b", 
        text: "b", 
        rank: -20,
        when: Date.now(),
        child: "mjr:ba",
        //sibA: "mjr:welcome",
        pack: "mjr:welcome",
        //prev: "",
        //next: "",
        //love: 0,
      }, 
      {
        _id: "mjr:c", 
        text: "c", 
        rank: -30,
        when: Date.now(),
        //child: "",
        //sibA: "mjr:welcome",
        pack: "mjr:welcome",
        //prev: "",
        //next: "",
        //love: 0,
      }, 
      {
        _id: "mjr:ba", 
        text: "ba", 
        rank: -10,
        when: Date.now(),
        //child: "",
        pack: "mjr:ba",
        //prev: "",
        //next: "",
        //love: 0,
      }, 
      {
        _id: "mjr:bb", 
        text: "bb", 
        rank: -20,
        when: Date.now(),
        //child: "",
        //sibA: "mjr:ba",
        pack: "mjr:ba",
        //prev: "",
        //next: "",
        //love: 0,
      }, 
      {
        _id: "mjr:bc", 
        text: "bc", 
        rank: -30,
        when: Date.now(),
        child: "mjr:bcb",
        //sibA: "mjr:ba",
        pack: "mjr:ba",
        //prev: "",
        //next: "",
        //love: 0,
      }, 
      {
        _id: "mjr:bcb", 
        text: "bcb", 
        rank: -10,
        when: Date.now(),
        //child: "",
        pack: "mjr:bcb",
        //prev: "",
        //next: "",
        //love: 0,
      }, 

    ];
    // For browse, index pack (alph) and then rank (highest first)
    Posts._ensureIndex({ pack: 1, rank: -1});
    // And for discovering direct parents, index child (oldest 1st)
    Posts._ensureIndex({ child: 1, when: 1 }, {sparse: true});

    for (var i = 0; i < posts.length; i++)
      Posts.insert(posts[i]);

  }
});
