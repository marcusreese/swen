describe('The home page', function() {

jasmine.DEFAULT_TIMEOUT_INTERVAL = 9999999;
  var browser;

  beforeEach(function (done) {
    wdio.getGhostDriver(function(_browser_) {
      browser = _browser_;
	browser
      .init()
      .url('http://localhost:3000')
      done();
    });
  });


    it('should have at least two subpages', function(done) {
        browser
      .waitForExist(".panel", 1000)
	.elements(".subpage", function(err, res) {
	expect(err).toBeFalsy();
        expect(res.value.length).not.toBeLessThan(2);
      })
            .call(done);
    });

  it('should have a title', function (done) {
    browser
      .title(function(err, res) {
	expect(err).toBeFalsy();
        expect(res.value).toBeTruthy();
      })
      .end()
      .call(done);
  });


});
