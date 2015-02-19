$.ajaxSetup({headers: {
    "X-Parse-Application-Id" : "K4zLqJj9DKABboTYQLeVyeQVBlhqOtJO7CrTQIEq",
    "X-Parse-REST-API-Key" : "Y7V0uUBdUqCe9sVMx1ZWEkllLDgxaJtp5tYCoTa7"
  }
});

var Bookmark = Backbone.Model.extend({
  idAttribute: 'objectId',
  defaults: function(opts) {
    opts = opts || {};
    return _.defaults({
      title: 'default-title',
      url: 'lame-address',
      tags: []  
    });
  }
});

var Bookmarks = Backbone.Collection.extend({
  model: Bookmark,
  url: "https://api.parse.com/1/classes/Bookmarks",
  parse: function(res) { return res.results; }  
});

var Tags = Backbone.Collection.extend({
  url: "https://api.parse.com/1/classes/Bookmarks",
  parse: function(res) { 
    /*
    var tagArray = [];
    res.results.forEach(function(result) {
      tagArray.push(result.tags);  
    });
    return _.flatten(tagArray, true);
    */
    return res.results;
  }
});

var FormNewBookmark = Backbone.View.extend({
  el: '.input-link',
  events: {
    'submit' : 'makeBookmark'
  },
  makeBookmark: function(e) {
    e.preventDefault();
    var title = this.$('.link-title').val();
    var url = this.$('.link-url').val();
    var tags = this.$('.link-tags').val().split(' ');
    this.collection.create({title: title, url: url, tags: tags});
    this.$('.link-title').val('');
    this.$('.link-url').val('');
    this.$('.link-tags').val('');
  }
});

var UrlsView = Backbone.View.extend({
  el: '.link-bucket',
  template: _.template($('[data-template="bookmark"]').text()),
  initialize: function() {
    this.listenTo(this.collection, 'sync add destroy', this.render);
  },
  render: function() {
    var self = this;
    this.$el.empty();
    this.collection.each(function(bookmark) {
      self.$el.append(self.template(bookmark.toJSON()));
    });
    return this;
  }
});

var TagsView = Backbone.View.extend({
  el: '.tags',
  template: _.template($('[data-template="tag"]').text()),  
  initialize: function() {
    this.listenTo(this.collection, 'sync add destroy', this.render);
  },
  events: {
    'click .tag': 'selectTag'
  },
  selectTag: function(e) { console.log($(e.target).text()); },
  render: function() {
    var self = this;
    this.$el.empty();
    var tags = [];
    this.collection.each(function(model) {
      model.get('tags').forEach( function(tag) { if (tags.indexOf(tag) === -1) { tags.push(tag); } });
      //self.$el.append(self.template({tags: model.get('tags')}));  
    });
    self.$el.append(self.template({tags: tags}));
    return this;
  }
});

var AppRouter = Backbone.Router.extend({
  routes: {
    '' : 'index',
   'tag/:tag' : 'sortByTag'
  },
  initialize: function() {
    this.bookmarks = new Bookmarks();
    this.tagsView = new TagsView({collection: this.bookmarks});
    this.urlView = new UrlsView({collection: this.bookmarks});
    this.formNew = new FormNewBookmark({collection: this.bookmarks});
  },
  index: function() {
    var self = this;
    this.bookmarks.fetch().done(function() { 
      self.urlView.render(); 
      self.tagsView.render();
    });
  },
  sortByTag: function(tag) {
    var self = this;
    this.bookmarks.fetch().done(function(data) {
      var filtered = _.filter(self.bookmarks.models, function(m) { 
        return m.get('tags').indexOf(tag) > -1; 
      });
      self.bookmarks.reset(filtered);
      self.urlView.render();
      self.tagsView.render();
    });
  }
});


$(document).ready(function() {
  window.appRouter = new AppRouter();
  Backbone.history.start();  
});
