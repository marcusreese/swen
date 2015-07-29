// browseSpec.js
"use strict";
describe("In browse mode,", function() {
  beforeEach(module("swen"));
  var modeService = {};
  beforeEach(inject(function (_modeService_) {
    modeService = _modeService_;
  }));
  it("the current (clicked or loaded) post is marked for highlighting.", function () {
    // i.e., load() selects posts via getClass()
    var scope = {};
    // args1 is args for load(), args2 is args for getClass()
    var args1 = {scope: scope}, args2 = {scope: scope};
    args1.rootScope = {};
    // The following url says that tester wrote test and test1, and they both are on page
    args1.route = "/tester:test/test1";
    // In first subpage, test wants to know if it is selected
    args2.sIndex = 0;
    args2.post = {_id: "tester:test"};
    modeService.browse.load(args1);
    var currentClass = modeService.browse.getClass(args2);
    // test is selected (marked for highlighting) because it is in the url.
    expect(currentClass).toBe("selected");
    // Now posts in second subpage wants to know if they are highlighted.
    // Start with the one that really is highlighted.
    args2.sIndex = 1;
    args2.post._id = "tester:test1";
    currentClass = modeService.browse.getClass(args2);
    expect(currentClass).toBe("selected");
    // Now what about some other post in second subpage that should not be highlighted?
    args2.post._id = "tester:test2";
    currentClass = modeService.browse.getClass(args2);
    expect(currentClass).toBe("");
  });
  it("a post is an internal link.", function () {
    // i.e., getRoute() does something.
    var scope = {};
    // args1 is args for load(), args2 is args for getRoute()
    var args1 = {scope: scope}, args2 = {scope: scope};
    args1.rootScope = {};
    args1.route = "/tester:test/test1";
    // Load fake page.
    modeService.browse.load(args1);
    // Now I'll pretend to be a post in first subpage.
    args2.sIndex = 0;
    args2.post = {_id: "tester:test"};
    // I call getRoute to see what my href should be.
    var currentRoute = modeService.browse.getRoute(args2);
    // Since there is no recently viewed parent, I'm just a link to myself.
    expect(currentRoute).toBe("/tester:test");
    // Now I'll pretend to be a post in second subpage.
    args2.sIndex = 1;
    args2.post._id = "tester:test1";
    currentRoute = modeService.browse.getRoute(args2);
console.log(currentRoute);
    expect(currentRoute).toBe("/tester:test/test1");
  });
});
