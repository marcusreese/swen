// isomorphic/draftSlug.js

Iso.draftSlug = function draftSlug(args) {
  // Takes user content and suggests a slug based on
  // the biggest word and the word that comes before it.
  "use strict";
  var words = [], 
    newWord = "",
    beforeBiggest = "",
    biggest = "";
  if (! args.scope.draft.text) throw new Error("No input found.");
  var words = args.scope.draft.text.split(/\s+/);
  for (var i in words) {
    // When there are beginning or ending spaces, the split includes "".
    if (words[i] === "") continue;
    newWord = Iso.formatSlug({ roughSlug: words[i] });
    if (newWord === "symbols") newWord = "";
    if (newWord.length > biggest.length) {
      biggest = newWord;
      if (i !== "0") beforeBiggest = Iso.formatSlug({ roughSlug: words[i-1] });
      if (beforeBiggest === "symbols") beforeBiggest = "";
    }
  }
  biggest = biggest.replace(/-$/, "");
  if (beforeBiggest) {
    beforeBiggest = beforeBiggest.replace(/-$/, "");
    args.formattedSlug = beforeBiggest + "-" + biggest;
  }
  else args.formattedSlug = biggest;
  return args.formattedSlug;
}

