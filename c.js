$.ajaxSetup({headers: {
    "X-Parse-Application-Id" : "K4zLqJj9DKABboTYQLeVyeQVBlhqOtJO7CrTQIEq",
    "X-Parse-REST-API-Key" : "Y7V0uUBdUqCe9sVMx1ZWEkllLDgxaJtp5tYCoTa7"
  }
});

var Post = Backbone.Model.extend({
  idAttribute: 'objectId',
  defaults: function(options) {
    options = options || {};
    return _.defaults({
      title: 'default',
      body: 'default' 
    });
  }
});


var Posts = Backbone.Collection.extend({
  model: Post,
  url: "https://api.parse.com/1/classes/Post",
  parse: function(res) { return res.results; }
});

var PostsListView = Backbone.View.extend({
  el: '.sidebar',
  template: _.template($('[data-template="post-li"]').text()),
  events: {
    'click .post-li': 'showFullPost'
  },
  showFullPost: function() {
  },
  render: function() {
    var self = this;
    this.collection.each(function(post) {
      self.$el.append( self.template( post.toJSON() ) ); 
    });
    return this;
  }
});

var PostFullView = Backbone.View.extend({
  tagName: 'div',
  className: 'full-post',
  template: _.template($('[data-template="full-post"]').text()),
  render: function() {
    this.$el.append(this.template(this.model.toJSON()));
    return this;
  }
});


var AppRouter = Backbone.Router.extend({
  routes: {
    '' : 'index',
    'post/:id' : 'showPost'
  },
  initialize: function() {
    this.posts = new Posts();
    this.postsList = new PostsListView({collection: this.posts});
  },
  index: function() {
    var self = this;
    this.posts.fetch().done(function() {
       self.postsList.render();  
    });
  },
  showPost: function(id) {
    var self = this;
    this.posts.fetch().done(function() {
      foundModel = self.posts.get(id);
      var postFull = new PostFullView({model: foundModel});
      postFull.render();
      $('.blogpost').html(postFull.el);
    });
  }
});

$(document).ready(function() {
  window.appRouter = new AppRouter();
  Backbone.history.start();
});
