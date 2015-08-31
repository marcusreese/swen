// isomorphic/idsToRoute.js
Iso.idsToRoute = function idsToRoute(idA, idB) {
  // Convert one or two ids into a route.
  if (! idA && ! idB) throw new Error("No input.");
  if (! idA) {
    idA = idB;
    idB = null;
  }
  var inputA = idA.split(":"),
      inputB = idB ? idB.split(":") : "",
      route = "/" + inputA[0] + ":/" + inputA[1],
      legitOptions;
  if (! inputA[1]) throw new Error("Invalid first id");
  if (inputB[0] === inputA[0]) {
    // Same poster/author, so abbreviate route.
    route += "/" + inputB[1];
  }
  else if (inputB[1]) {
    route += "/" + inputB[0] + ":/" + inputB[1];
  }
  else if (idB === "-") {
    // To force single id to parent position (subpage0).
    route += "/-";
  }
  else if (idB) throw new Error("Invalid second id.");
  /*
  // Check options.
  legitOptions = {
    "draft-first-sibling": "edit",
    "update-focus-post": "edit",
    "draft-next-sibling": "edit",
    "draft-first-child": "edit",
    "draft-last-child": "edit"
  };
  if (option && ! legitOptions[option]) throw new Error("Unrecognized option");
  if (option) {
    route += "\?" + legitOptions[option] + "=" + option;
  }
  */
  return route;
}
