// Take a url path and return an array of post ids.
Iso.parsePath = function(path) {
	// Remove initial slash.
	path = path.slice(1);
	// Get ids, but some may be abbreviated.
	var ids = path.split("/"), prevPoster = "";
	// Expand abbreviated ids.
	ids = ids.map(function expand(id) {
		var parts = id.split(":");
		if (! parts[1] && ! prevPoster) throw new Error("Incorrect URL.");
		if (parts.length > 1) prevPoster = parts[0];
		else id = prevPoster + ":" + id;
		return id;
	});
	return ids;
}
