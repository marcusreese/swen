// Publish a post and its context.
var getPacks = function(ids) {
  return (Meteor.wrapAsync(Meteor.call.bind(Meteor)))("getGenerations", ids);
}
Meteor.publish("postEtc", function (path) {
  check(path, String);
  // For testing /?jasmine...
  path = path.split("?")[0];
  if (path === "/") path = "/mjr:welcome";
  // For testing /karma...
  var first6 = path.slice(0,6);
  if (first6 === "/karma") return;
  var ids = Iso.parsePath(path), a = [], packs = [];
  a = getPacks(ids);
  packs = a.map(function(x) {return x.post? x.post.pack : "";});
  return Posts.find({ pack: { $in: packs }});
});
FastRender.onAllRoutes(function(path) {
  // At some point the default may change based on dns, but for now...
  this.subscribe("postEtc", path);
});
