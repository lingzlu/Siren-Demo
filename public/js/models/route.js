var App = App || {};

App.RouteModel = Parse.Object.extend("Route", {
	defaults: {
		user_ptr: '',
		startAddress: {},
		endAddress: {},
     	rating : 0,
     	alarm : false,
     	position : {},
     	segments : [],
     	maxRating : []
     	//current position
    },
	routeURL: function() {
		return "/Route/"+this.id;
	}
});	