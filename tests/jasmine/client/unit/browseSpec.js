// browseSpec.js
"use strict";
describe("In browse mode,", function() {
  beforeEach(module("swen"));
  var modeService = {};
  beforeEach(inject(function (_modeService_) {
    modeService = _modeService_;
  }));
  it("the current (clicked or loaded) post is marked for highlighting", function () {
    //i.e., .load() selects posts via .getClass()
    var scope = {};
    var args1 = {scope: scope}, args2 = {scope: scope};
    args1.rootScope = {};
    args1.route = "/tester:test/test1";
    args2.sIndex = 0;
    args2.post = {_id: "tester:test"};
    modeService.browse.load(args1);
    var currentClass = modeService.browse.getClass(args2);
    expect(currentClass).toBe("selected");
    args2.sIndex = 1;
    args2.post._id = "tester:test1";
    currentClass = modeService.browse.getClass(args2);
    expect(currentClass).toBe("selected");
    args2.post._id = "tester:test2";
    currentClass = modeService.browse.getClass(args2);
    expect(currentClass).toBe("");
  });
});
