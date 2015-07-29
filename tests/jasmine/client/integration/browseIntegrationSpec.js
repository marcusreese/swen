// browseIntegrationSpec.js
"use strict";
describe("When page is loaded,", function(done) {
  it("the default route is '/mjr:welcome'.", function() {
    expect(location.pathname).toBe("/mjr:welcome");
  });
});
describe("In browse mode,", function(done) {
  it("a post is a link to the last viewed parent.", function () {
    // i.e., getRoute() works.
    // Simulate loading /mjr:b/mjr:bc and then /mjr:bc/mjr:bcb
    // Then see if bc remembers its parent (i.e. if bc has an href)
    
  });
});
