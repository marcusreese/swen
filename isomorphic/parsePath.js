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
  // If there is a final slash, remove that, too.
  if (path.slice(-1) === "/") path = path.slice(0,-1);
  // Get segments.
  segments = path.split("/");
  // Check for invalid urls
  if (segments[0] === "karma") {
    console.log("detected karma");
    segments = ["karma:","debug.html"];
  }
  // Use ":/" to mark the end of the poster's username, to allow
  // user-friendly urls that are not strict about number of slashes.
  else if (
    segments[0].slice(-1) !== ":" ||
    (segments.length > 3 && segments[2].slice(-1) !== ":")
  )
    throw new Error("Incorrect URL: " + path);
  // Expand abbreviated ids.
  ids = segments.reduce(tryForId, []);
  function tryForId(idsArray, segment) {
    // If segment ends with colon, as in every first segment, it's poster.
    if (segment.slice(-1) === ":") poster = segment;
    // Otherwise it is probably a slug and completes an id.
    else if (segment !== "-") {
      idsArray.push(poster + segment); 
    }
    else {
      // But in a route like "/poster:/a/-", the final hyphen or minus
      // shows that post a is meant to be in the first subpage
      // and none of its child posts are meant to be highlighted,
      // probably to allow for an insertion form at the beginning
      // of the second subpage.
      idsArray.push("-");
    }
    // Pass idsArray to next segment from left to right.
    return idsArray;
  }
  return ids;
}
