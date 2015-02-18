$.ajaxSetup({headers: {
    "X-Parse-Application-Id" : "K4zLqJj9DKABboTYQLeVyeQVBlhqOtJO7CrTQIEq",
    "X-Parse-REST-API-Key" : "Y7V0uUBdUqCe9sVMx1ZWEkllLDgxaJtp5tYCoTa7"
  }
});

var Post = Backbone.Model.extend({
  idAttribute: 'objectId',
  defaults: function(options) {
    var options = options || {};
    return _.defaults({
      'title': 'DUMMY TITLE',
      'body': 'BODY TEXT BODY TEXT BODY TEXT' 
    });
  }
});

var Posts = Backbone.Collection.extend({
  model: Post,
  url: "https://api.parse.com/1/classes/Post"  
});

var PostNewView = Backbone.View.extend({
  el: '#save-post',
  events: {
    'submit' : 'savePost'
  },
  savePost: function(e) {
    e.preventDefault();
    var myTitle = this.$('.title').val();
    var myBody = this.$('.body').val();
    this.collection.create({title: myTitle, body: myBody});
    this.$('.title').val('');
    this.$('.body').val('');
  }
});



var posts = new Posts();
var postNew = new PostNewView({collection: posts});
