"use strict";
angular.module("swen").run(["modeService", 
	function addEdit(modeService) {
		function edit() { 
			var editable = {};
			return {

// Letting all returned functions start at the left margin, for readability.

isEditable: function isEditable(post) {
	return post._id === editable._id;
},

click: function click(args) {
	editable = args.post;
	args.scope.draft.text = args.post.text;
},

submit: function submit(args) {
	args.post.text = args.scope.draft.text;
	args.scope.subpage.save(args.post);
	editable = {};
}

// That's all the returned functions, so leaving left margin again.

			} // End of return block
		} // End of edit function
        	modeService.addMode("Edit", edit());
	} // End of addEdit function
]); // End of run function

