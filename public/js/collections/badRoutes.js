var App = App || {};

App.BadRoutes = Parse.Collection.extend({
  model: App.RouteModel,
  query: (new Parse.Query(App.RouteModel)).equalTo("user_ptr", Parse.User.current()).equalTo("alarm" , true),
  comparator: function(object) {
    return -object.get('maxRating')[0];
  }
});

App.badRoutes = new App.BadRoutes();