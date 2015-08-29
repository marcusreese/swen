// isomorphic/idsToRoute.js
Iso.idsToRoute = function idsToRoute(idA, idB) {
  // A simple but often repeated task: to convert one or two ids into a route.
  if (! idA) throw new Error("No input.");
  var partsA = idA.split(":"),
      partsB = idB ? idB.split(":") : "",
      routeStart = "/" + partsA[0] + ":/" + partsA[1],
      routeEnd = "";
  if (idB && partsA[0] === partsB[0]) {
    // They have the same poster/author, so abbreviate.
    routeEnd = "/" + partsB[1];
  }
  else if (idB) {
    // They have different posters, so be explicit.
    routeEnd = "/" + partsB[0] + ":/" + partsB[1];
  }
  return routeStart + routeEnd;
}
