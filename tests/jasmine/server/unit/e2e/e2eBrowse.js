// /tests/jasmine/unit/e2e/e2eBrowse.js
// This directory path is required by as of July 2015
"use strict";
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

/*
  it('should have at least three subpages', function(done) {
    this.browser
    // Wait one second for third subpage to load
    .waitForExist("#0_2", 1000)
    .then(function (success) {
      expect(success).toBe(true);
    })
    .end()
    .call(done);
  });
*/

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
