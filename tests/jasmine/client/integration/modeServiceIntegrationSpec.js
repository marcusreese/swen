// browseIntegrationSpec.js
"use strict";
describe('When page is loaded,', function(done) {
beforeEach(angular.mock.module("swen"));
        it("the default route is '/mjr:welcome'.", function() {
                expect(location.pathname).toBe("/mjr:welcome");
        });
        it("there should be at least 2 subpages.", function() {
		expect($(".panel").children().length).not.toBeLessThan(2);
        });
        it("there should be posts.", function() {

        });

});
