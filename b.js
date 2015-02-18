$.ajaxSetup({headers: {
    "X-Parse-Application-Id" : "K4zLqJj9DKABboTYQLeVyeQVBlhqOtJO7CrTQIEq",
    "X-Parse-REST-API-Key" : "Y7V0uUBdUqCe9sVMx1ZWEkllLDgxaJtp5tYCoTa7"
  }
});

var Person = Backbone.Model.extend({
  idAttribute: 'objectId',
  defaults: function(options) {
    options = options || {};
    return _.defaults({
      fname: 'first',
      lname: 'last',
      address: '100 main st',
      phone: '5555555555'  
    });
  }
  
});

var People = Backbone.Collection.extend({
  model: Person,
  url: "https://api.parse.com/1/classes/People"  
});

var PersonNewView = Backbone.View.extend({
  el: '.person-save',
  events: {
    'submit' : 'babyMaker'
  },
  babyMaker: function(e) {
    e.preventDefault();
    var fname = this.$('.fname').val(),
        lname = this.$('.lname').val(),
        address = this.$('.address').val(),
        phone = this.$('.phone').val();
    this.collection.create({
        fname: fname,
        lname: lname,
        address: address,
        phone: phone  
    });
    this.$('input').val('');
    this.$('input[type="submit"]').val('Submit');
  }

});

var myPeeps = new People();
var openTheDoorsAndSeeAllThePeople = new PersonNewView({collection: myPeeps});
