// parsePathSpec.js
"use strict";
describe("Either client or server", function(done) {
  it("can infer who posted each post listed in a url.", function() {
    var ids = Iso.parsePath("/tester:test0/test1")
    // There are two ids in the route.
    expect(ids.length).toBe(2);
    // The first id is full.
    expect(ids[0]).toBe("tester:test0");
    // The second id is abbreviated in the route.
    expect(ids[1]).toBe("tester:test1");
  });
});
