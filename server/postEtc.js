// Publish a post and its context.
var getFociAsIfSync = function(ids) {
  // Allow fibers to deal with async, avoiding callbacks in server code.
  return (Meteor.wrapAsync(Meteor.call.bind(Meteor)))("getFoci", ids);
}
Meteor.publish("postEtc", function (path) {
  check(path, String);
  // For testing /?jasmine...
  path = path.split("?")[0];
  // "/" will be redirected.
  if (path === "/") return [];
  // For testing /karma...
  var first6 = path.slice(0,6);
  if (first6 === "/karma") return [];
  else if (path === "/context.html") return []; // Another Karma thing I guess.
  var ids = Iso.parsePath(path), a = [], packs = [];
  a = getFociAsIfSync(ids);
  if (a === undefined) return [];
  packs = a.map(function(x) {return x.pack;});
  return Posts.find({ pack: { $in: packs }});
});
FastRender.onAllRoutes(function(path) {
  // At some point the default may change based on dns, but for now...
  this.subscribe("postEtc", path);
});
