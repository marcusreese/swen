// editSpec.js
"use strict";
describe('edit', function() {
        beforeEach(module("swen"));
        var modeService = {};
        beforeEach(inject(function (_modeService_) {
                modeService = _modeService_;
        }));

  it(".submit() can change the text of a post", function () {
    var post = {text: "old text"};
    var scope = {draft: {text: "new text"}};
    scope.panelA = [{save: function(obj) { post.text = obj.text;}}];
    modeService.edit.submit({post: post, scope: scope, sIndex: 0}); 
    expect(post.text).toBe("new text");
  });
  it(".click() makes a post editable via .isEditable()", function () {
    modeService.edit.click({
      post: {_id: "test"}, 
      scope: {draft: {text: ""}},
      event: {preventDefault: function () {}}
    });
    expect(modeService.edit.isEditable({_id: "test"})).toBe(true);
  });
});
