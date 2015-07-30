// editSpec.js
"use strict";
describe('In edit mode,', function() {
        beforeEach(module("swen"));
        var modeService = {};
        beforeEach(inject(function (_modeService_) {
                modeService = _modeService_;
        }));

  it("clicking 'Sibling' or 'Child' can change the text of a post", function () {
    var post = {text: "old text"};
    var scope = {};
    scope.panelA = [{save: function(obj) { post.text = obj.text;}}];
    scope.draft = {text: "new text"};
    modeService.edit.sibling({post: post, scope: scope, sIndex: 0}); 
    expect(post.text).toBe("new text");
    scope.draft = {text: "newer text"};
    modeService.edit.child({post: post, scope: scope, sIndex: 0}); 
    expect(post.text).toBe("newer text");
  });
  it("clicking a post makes it editable.", function () {
    // i.e., click() makes a post editable via isEditable()
    modeService.edit.click({
      post: {_id: "test"}, 
      scope: {draft: {text: ""}},
      event: {preventDefault: function () {}}
    });
    expect(modeService.edit.isEditable({_id: "test"})).toBe(true);
  });

//Should we do something like...
//[Insert sibling] [Edit next] [Insert child] [Edit first]

  // Enter adds a new line and highlights first option: Next Sibling
  // So enter tab enter goes to first child, similar to workflowy enter tab
  // Tab goes straight to first option: Next sibling (we can use spaces instead of tabs?)
  // (To go to last sibling, escape l for last, e for edit?)
});
