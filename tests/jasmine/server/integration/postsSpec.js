//postsSpec.js
describe('The server', function () {
  it('should have posts available', function () {
     expect(Posts.find().count()).toBeGreaterThan(0);
  });
});
