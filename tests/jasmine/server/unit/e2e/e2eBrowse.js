beforeAll(function (done) {
  var self = this;
  wdio.getGhostDriver(function (browser) {
    self.browser = browser;
    done();
  });
});

describe('The home page', function() {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 9999999;
  var browser;

  beforeEach(function (done) {
    this.browser
    .init()
    .url('http://localhost:3000')
    done();
  });


  it('should have at least two subpages', function(done) {
    this.browser
    // Wait for most of page to be loaded
    .waitForExist("#jasmine-mirror", 1000)
    .elements(".subpage", function(err, res) {
      expect(err).toBeFalsy();
      expect(res.value.length).not.toBeLessThan(2);
    })
    .call(done);
  });

  it('should have a title', function (done) {
    this.browser
    .title(function(err, res) {
      expect(err).toBeFalsy();
      expect(res.value).toBeTruthy();
    })
    .end()
    .call(done);
  });


});
