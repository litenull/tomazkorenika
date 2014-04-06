var blog = {
	initialize: function() {
		var self = this;
		this.fetchPosts(function(posts) {
			var sorted = _.sortBy(posts, function(item) {
				return new Date(item.date).getTime();
			}).reverse();
			async.eachSeries(sorted, self.renderPost, function(err) {

			});
		})
	},
	fetchPosts: function(callback) {
		$.get('/posts/posts.json', function(response) {
			callback(response);
		})
	},
	renderPost: function(object, callback) {
		var template;
		$.get('/views/post.html', function(response) {
			$.get('/posts/' + object.file, function(res) {
				object.content = Markdown(res);
				template = Handlebars.compile(response)(object);
				$('.posts').append(template);
				if (template.indexOf('<code>') >= 0) {
					hljs.highlightBlock($('#' + object.id).find('code')[0]);
				}
				callback(null);
			});
		});
	}
}

hljs.initHighlightingOnLoad();
blog.initialize();