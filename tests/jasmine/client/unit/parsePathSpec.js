// parsePathSpec.js
"use strict";
describe("Either client or server", function () {
  it("can infer who posted each post listed in a url.", function() {
    var ids = Iso.parsePath("/tester:/testA/testB")
    // There are two ids in the route.
    expect(ids.length).toBe(2);
    expect(ids[0]).toBe("tester:testA");
    expect(ids[1]).toBe("tester:testB");
    expect(ids).toEqual(["tester:testA","tester:testB"]);
  });
  it("will allow an accidental slash at the end of a url.", function () {
    var ids = Iso.parsePath("/tester:/testA/testB/");
    expect(ids.length).toBe(2);
  });
});

