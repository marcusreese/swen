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
	args.event.preventDefault();
	editable = args.post;
	args.scope.draft.text = args.post.text;
},

submit: function submit(args) {
	args.post.text = args.scope.draft.text;
	// If the following breaks due to changes in index,
	// could try using args.scope.subpage.save(args.post).
	args.scope.panelA[args.sIndex].save(args.post);
	editable = {};
}

// That's all the returned functions, so leaving left margin again.

			} // End of return block
		} // End of edit function
        	modeService.addMode("Edit", edit());
	} // End of addEdit function
]); // End of run function

/*
// A little algorithm for temp avoiding breaking up long stuff.
if (input.length > 200) {
	msgToUser("large input not yet supported");
	input = input.slice(0,300);
}

// A little algorigthm for choosing a slug.
$scope.beforeBiggest = "";
$scope.biggest = "";
var newWord = "", beforeNew = "";
if (newWord.length > biggest.length) {
	$scope.biggest = newWord;
	$scope.beforeBiggest = beforeNew;
}
*/
