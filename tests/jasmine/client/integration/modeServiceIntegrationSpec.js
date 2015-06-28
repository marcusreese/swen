// modeServiceIntegrationSpec.js
/* Removing as I get "ReferenceError: module is not defined".
	Instead I'm doing these tests as unit tests, where it's working.
	My justification: modeService is a unit.
		So integration can include other services and controller etc.
describe('In modeService, the browse mode', function() {
        beforeEach(module("swen"));
        // Access the real ModeService as $modeService.
        var $modeService = {};
        beforeEach(inject(function (_modeService_) {
                $modeService = _modeService_;
        }));
        it("is listed first", function() {
                var modesArray = $modeService.getModes();
                expect(modesArray[0].codeValue).toBe("browse");
        });
        it("is the default", function() {
                var modeString = $modeService.getDefaultMode();
                expect(modeString).toBe("browse");
        });

});
*/
