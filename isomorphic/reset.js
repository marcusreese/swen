// isomorphic/reset.js
Meteor.methods({
  reset: function reset() {
    Posts.remove({});
    // Copied from my server/startup.js:
    if (Posts.find().count() === 0) {
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
        childA: "demo:my-child-notes",
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
        childA: "demo:is-temporary",
        pack: "demo:in-progress",
        next: "demo:these-sentences",
        //love: 0,
      });
      var morePosts = [{ "_id" : "demo:i-m-selected", "text" : "You did it. Click here to see that I have no child notes.", "rank" : -10, "when" : 1441297847652, "pack" : "demo:i-m-selected", "parentA" : "demo:my-child-notes", "next" : "demo:by-clicking" },
      { "_id" : "demo:by-clicking", "text" : "But you can add a child note by clicking the edit pencil icon and then clicking 'GO DEEPER'.", "rank" : -20, "when" : 1441310182313, "pack" : "demo:i-m-selected", "parentA" : "demo:my-child-notes" },
      { "_id" : "demo:done-editing", "text" : "Then you can click 'SAVE' if you are done editing.", "rank" : -20, "when" : 1441310578800, "pack" : "demo:currently-highlighted", "parentA" : "demo:these-sentences", "next" : "demo:more-sentences" },
      { "_id" : "demo:my-child-notes", "text" : "I am child-note of the highlighted note above (and if you click me, you see my child-notes.)", "rank" : -10, "when" : 1441297732176, "pack" : "demo:my-child-notes", "parentA" : "demo:in-progress", "childA" : "demo:i-m-selected" },
      { "_id" : "demo:currently-highlighted", "text" : "The edit pencil button at the top puts the currently highlighted text into an editable textarea.", "rank" : -10, "when" : 1441310509801, "pack" : "demo:currently-highlighted", "parentA" : "demo:these-sentences", "next" : "demo:done-editing" },
      { "_id" : "demo:these-sentences", "text" : "(And if you don't know how, you can click on any of these sentences for more details.)", "rank" : -30, "when" : 1441310430619, "pack" : "demo:in-progress", "parentA" : "demo:welcome", "next" : "", "childA" : "demo:currently-highlighted" },
      { "_id" : "demo:the-continue", "text" : "The 'CONTINUE' button allows you to add a \"sibling\" note, meaning another sentence in the same area.", "rank" : -40, "when" : 1441310697833, "pack" : "demo:currently-highlighted", "parentA" : "demo:these-sentences", "next" : "demo:a-footnote" },
      { "_id" : "demo:more-sentences", "text" : "But if you want to create more sentences, click one of the other two buttons.\n\n", "rank" : -30, "when" : 1441310639337, "pack" : "demo:currently-highlighted", "parentA" : "demo:these-sentences", "next" : "demo:the-continue" },
      { "_id" : "demo:a-footnote", "text" : "The 'GO DEEPER' button allows you to add a \"child\" note, which is like a comment or a footnote.", "rank" : -50, "when" : 1441310760547, "pack" : "demo:currently-highlighted", "parentA" : "demo:these-sentences" },
      {"_id":"demo:is-temporary","text":"The content is \"temporary\" because this is just a demo, and any user can erase all new content from the database with that little RESET button at the top!","rank":-10,"when":1441321377129,"pack":"demo:is-temporary","parentA":"demo:feel-free"}];
      morePosts.forEach(function (post) {
        Posts.insert(post);
      });
    } // End if no posts
  }
});
