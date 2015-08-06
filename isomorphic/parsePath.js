// Take a url path and return an array of post ids.
Iso.parsePath = function parsePath(path) {
  // Remove initial slash.
  path = path.slice(1);
  // If final slash, remove that too.
  if (path[path.length-1] === "/") path = path.slice(0, -1);
  // Get ids, but some may be abbreviated.
  var ids = path.split("/"), poster = "", slug = "";
  // Expand abbreviated ids.
  ids = ids.map(function expand(id) {
    //If this is the first id, id should be like poster:post
    var parts = id.split(":");
    // If there are indeed two parts, poster is first part. 
    if (parts.length > 1) {
      poster = parts[0];
      slug = parts[1];
    }
    // Otherwise, this is abbreviated, relying on a previously noted poster.
    else if (poster) {
      slug = parts[0];
    }
    // Karma runs with route /karma/debug.html, so skip
    else if (parts[0] === "karma" || parts[0] === "debug.html") {
      poster = "tester";
      slug = "testA";
    }
    else if (! parts[1] && ! poster) {
      console.log("Incorrect URL segment is " + parts[0]);
      throw new Error("Incorrect URL.");
    }
    id = poster + ":" + slug;
    return id;
  });
  return ids;
}
