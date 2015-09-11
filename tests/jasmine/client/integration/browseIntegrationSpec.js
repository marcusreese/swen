// /tests/jasmine/client/integration/browseIntegrationSpec.js
"use strict";
describe("When page is loaded,", function(done) {
  beforeEach(module("swen"));
  var modeService = {};
  beforeEach(inject(function (_modeService_) {
          modeService = _modeService_;
  }));
  it("the default route is '/demo:/welcome/in-progress'.", function() {
    expect(location.pathname).toBe("/demo:/welcome/in-progress");
  });
});
