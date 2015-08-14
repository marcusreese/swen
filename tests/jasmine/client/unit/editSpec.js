// /tests/jasmine/client/unit/editSpec.js
"use strict";
describe('In edit mode,', function() {
  beforeEach(module("swen"));
  var modeService = {};
  beforeEach(inject(function (_modeService_) {
          modeService = _modeService_;
  }));

  it("clicking 'Sibling' can change the text of a post", function () {
    var post = {text: "old text"},
      scope = {},
      subpage = {save: function(obj) { post.text = obj.text;}};
    scope.draft = {text: "new text"};
    modeService.edit.sibling({post: post, scope: scope, subpage: subpage, rootScope: {}}); 
    expect(post.text).toBe("new text");
    scope.draft = {text: "newer text"};
    //modeService.edit.child({post: post, scope: scope, subpage: subpage}); 
    //expect(post.text).toBe("newer text");
  });

  // Enter adds a new line and highlights first option: Next Sibling
  // So enter tab enter goes to first child, similar to workflowy enter tab
  // Tab goes straight to first option: Next sibling (we can use spaces instead of tabs?)
  // (To go to last sibling, escape l for last, e for edit?)
});
