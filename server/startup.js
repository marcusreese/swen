Meteor.startup(function () {
	if (Posts.find().count() === 0) {

		var posts = [{_id: 'mjr/hey', text: 'Hey', rank: 0}, {_id: 'mjr/world', text: 'world!', rank: 1}];

		for (var i = 0; i < posts.length; i++)
			Posts.insert(posts[i]);

	}
});
