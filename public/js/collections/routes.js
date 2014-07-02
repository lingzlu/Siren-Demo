var App = App || {};

App.RouteCollection = Parse.Collection.extend({
  model: App.RouteModel,
  comparator: function(object) {
    return -object.get('maxRating')[0];
  }
});

App.routeCollection = new App.RouteCollection();