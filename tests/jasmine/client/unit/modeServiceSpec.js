// modeServiceSpec.js
"use strict";
describe('modeService', function() {
	beforeEach(module("swen"));
	// Access the real modeService as $modeService.
	var $modeService = {};
	beforeEach(inject(function (_modeService_) {
		$modeService = _modeService_;
	}));

	it(".getModes() provides capitalized and lowercase mode names", function() {
		var modesArray = $modeService.getModes();
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
		var modeString = $modeService.getCurrentMode();
		expect(modeString).toBe("browse");
	});
	it(".setCurrentMode() changes result of getCurrentMode()", function () {
		$modeService.setCurrentMode("edit");
		expect($modeService.getCurrentMode()).toBe("edit");
	});
	it(".addMode() can add a mode", function () {
		var count = $modeService.getModes().length;
		var insert = function insert() {
			return {
				test: function () {}
			}
		}
		$modeService.addMode("Insert", insert);
		expect($modeService.getModes().length).toBe(count + 1);
		expect(typeof $modeService.insert.test).toBe("function");
	});
	it(".edit can change the text of a post", function () {
		// Use a fake post.
		var post = {text: "old text"};
		var draft = {text: "new text"};
		// Use a fake subpage.
		var subpage = {save: function(obj) { post.text = obj.text;}};
		$modeService.edit.submit(draft, post, subpage); 
		expect(post.text).toBe("new text");
	});
	it(".edit makes the clicked post editable", function () {
		$modeService.edit.click({_id: "test"}, {text: ""});
		expect($modeService.edit.isEditable({_id: "test"})).toBe(true);
	});
	it(".browse.click selects a post", function () {
		$modeService.browse.click({_id: "test"});
		expect($modeService.browse.getClass({_id: "test"})).toBe("selected");
	});

});
