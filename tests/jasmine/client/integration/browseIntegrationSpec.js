// browseIntegrationSpec.js
"use strict";
describe('When page is loaded,', function(done) {
        it("the default route is '/mjr:welcome'.", function() {
                expect(location.pathname).toBe("/mjr:welcome");
        });
});
