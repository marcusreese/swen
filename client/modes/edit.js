"use strict";
var app = angular.module("swen");
app.run(["modeService", function addEdit(modeService) {
        modeService.addMode("Edit", edit);
}]);

function edit() { 
	var editableId = "";
	return {
		isEditable: function isEditable(post) {
			return post._id === this.editableId;
		},
		click: function click(post, draft) {
			this.editableId = post._id;
			draft.text = post.text;
		},
		submit: function submit(draft, post, subpage) {
			post.text = draft.text;
        	        subpage.save(post);
        	        this.editableId = "";;
		}
	};
}


