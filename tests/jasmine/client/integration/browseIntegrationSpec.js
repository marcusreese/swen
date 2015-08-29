// browseIntegrationSpec.js
"use strict";
describe("When page is loaded,", function(done) {
  it("the default route is '/dw:/welcome/work-in-progress'.", function() {
    expect(location.pathname).toBe("/dw:/welcome/work-in-progress");
  });
});
