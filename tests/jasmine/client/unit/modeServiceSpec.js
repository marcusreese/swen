// modeServiceSpec.js
"use strict";
describe('modeService', function() {
	beforeEach(module("swen"));
	var modeService = {};
	beforeEach(inject(function (_modeService_) {
		modeService = _modeService_;
	}));

	it(".getModes() provides capitalized and lowercase mode names", function() {
		var modesArray = modeService.getModes();
		expect(modesArray[0].codeValue).toBe("browse");
		expect(modesArray[0].displayValue).toBe("Browse Mode");
		var uncapitalized = "", separator = "";
		for (var m in modesArray) {
			var words = modesArray[m].displayValue.split(" ");
			for (var w in words) {
				if (uncapitalized)
					separator = ", ";
				if (words[w][0] !== words[w][0].toUpperCase())
					uncapitalized += separator + words[w];
			}
		}
		expect(uncapitalized).toBe("");
	});
	it(".getCurrentMode() works from the beginning", function () {
		var modeString = modeService.getCurrentMode();
		expect(modeString).toBe("browse");
	});
	it(".setCurrentMode() changes result of getCurrentMode()", function () {
		modeService.setCurrentMode("edit");
		expect(modeService.getCurrentMode()).toBe("edit");
	});
	it(".addMode() can add a mode", function () {
		var count = modeService.getModes().length;
		function insert() {
			return {
				test: function () {}
			}
		}
		modeService.addMode("Insert", insert());
		expect(modeService.getModes().length).toBe(count + 1);
		expect(typeof modeService.insert.test).toBe("function");
	});
	it(".edit.submit() can change the text of a post", function () {
		var post = {text: "old text"};
		var scope = {draft: {text: "new text"}};
		// Use a fake subpage.
		scope.subpage = {save: function(obj) { post.text = obj.text;}};
		modeService.edit.submit({post: post, scope: scope}); 
		expect(post.text).toBe("new text");
	});
	it(".edit.click() makes a post editable via .isEditable()", function () {
		modeService.edit.click({post: {_id: "test"}, scope: {draft: {text: ""}}});
		expect(modeService.edit.isEditable({_id: "test"})).toBe(true);
	});
	it(".browse.click() selects a post", function () {
		modeService.browse.click({post: {_id: "test", first: "test"}, scope: {}});
		expect(modeService.browse.getClass({_id: "test"})).toBe("selected");
	});

});
