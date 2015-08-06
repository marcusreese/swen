Meteor.methods({
  getGenerations: function getGens(ids) {
    // Takes at least one id returned from path (via Iso.parsePath).
    // Returns the three focus posts for a panel.
    check(ids, Array);
    var a = [{}, {}, {}], expected = {};
    a[0].post = Posts.findOne({ _id: ids[0] });
    if (ids[1]) {
      expected[1] = true;
      a[1].post = Posts.findOne({ _id: ids[1] });
    }
    else if (a[0].post && a[0].post.childA) {
      expected[1] = true;
      a[1].post = Posts.findOne({ _id: a[0].post.childA });
    }
    if (ids[2]) {
      expected[2] = true;
      a[2].post = Posts.findOne({ _id: ids[2] });
    }
    else if (a[1] && a[1].post && a[1].post.childA) {
      expected[2] = true;
      a[2].post = Posts.findOne({ _id: a[1].post.childA });
    }
    if ((! expected[2] || a[2].post) && (! expected[1] || a[1].post)) {
      return a;
    }
  },
  
});
