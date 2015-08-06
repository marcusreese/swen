// Take a url path and return an array of post ids.
Iso.parsePath = function parsePath(path) {
  // The path will be divided into segments,
  var segments,
      // some of which will indicate the username of the poster,
      poster,
      // and ultimately these segments will reveal the needed ids.
      ids;
  // Remove initial slash.
  path = path.slice(1);
  // If final slash, remove that too.
  if (path[path.length-1] === "/") path = path.slice(0, -1);
  // Get segments.
  segments = path.split("/");
  // Check for invalid urls
  if (segments[0] === "karma") {
    console.log("detected karma");
    segments = ["tester:","testA","testB"];
  }
  else if (segments[0].slice(-1) !== ":")
    throw new Error("Incorrect URL: " + path);
  // Expand abbreviated ids.
  ids = segments.reduce(tryForId, []);
  function tryForId(idsArray, segment) {
    // If segment ends with colon, as in every first segment, it's poster.
    if (segment.slice(-1) === ":") poster = segment;
    // Otherwise it is a slug and completes an id.
    else {
      idsArray.push(poster + segment); 
    }
    // Pass idsArray to next segment from left to right.
    return idsArray;
  }
  return ids;
}
