"use strict";
angular.module("swen").run(["modeService", 
	function addInsert(modeService) {
		function insert() { 
			var insertable = {};
			return {

// Letting all returned functions start at the left margin, for readability.

isInsertable: function isInsertable(post) {
	return post._id === insertable._id;
},

click: function click(args) {
	insertable = args.post;
	args.scope.draft.text = args.post.text;
},

submit: function submit(args) {
	args.post.text = args.scope.draft.text;
	args.scope.subpage.save(args.post);
	insertable = {};
}

// That's all the returned functions, so leaving left margin again.

			} // End of return block
		} // End of insert function
        	modeService.addMode("Insert", insert());
	} // End of addInsert function
]); // End of run function

