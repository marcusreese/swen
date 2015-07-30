// parsePathSpec.js
"use strict";
describe("Either client or server", function () {
  it("can infer who posted each post listed in a url.", function() {
    var ids = Iso.parsePath("/tester:testA/testB")
    // There are two ids in the route.
    expect(ids.length).toBe(2);
    // The first id is full.
    expect(ids[0]).toBe("tester:testA");
    // The second id is abbreviated in the route.
    expect(ids[1]).toBe("tester:testB");
  });
  it("will allow an accidental slash at the end of a url.", function () {
    var ids = Iso.parsePath("/tester:testA/testB/");
    expect(ids.length).toBe(2);
  });
});

