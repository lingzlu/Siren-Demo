var App = App || {};


App.View.RoutePage = Parse.View.extend({
	className: 'list-group',
	tagName: 'ul',

	navTemplate: _.template($('#main-nav-template').html()),
	template: _.template($('#route-page-template').html()),

	events: {
		"click #newRoute" : "routeModal",
		 "change #filterKeyword": "filterRoute"
	},
	initialize: function() {
		_.bindAll(this, 'addAll', 'addOne', "routeModal");
		App.routeCollection.bind ('reset', this.addAll);
		App.routeCollection.bind ('destroy', this.addAll);
		App.routeCollection.bind ('add', this.addAll);
		App.routeCollection.query = new Parse.Query(App.RouteModel);
		App.routeCollection.query.equalTo("user_ptr", Parse.User.current());
		App.routeCollection.fetch({reset:true});


	},
	render: function() {

		// if ("WebSocket" in window)
	 //    {
	 //      console.log("WebSocket is supported by your Browser!");
	 //      var scheme = window.location.protocol == 'https:' ? 'wss://' : 'ws://';
	 //      var defaultAddress = scheme + window.location.host + '/notification';
	 //          // var ws = new WebSocket(defaultAddress);// for deployment
	          
	 //        var ws = new WebSocket("ws://54.243.63.41/notification");

	 //        ws.onopen = function()
	 //        {
	 //          //sending the route id
	 //          ws.send("AZHgpjm1PR");
	          
	 //          console.log("Rout id is sent...");
	 //        }
	 //        ws.onmessage = function (evt) 
	 //        { 
	 //            //after 15 seconds server will response
	 //            console.log(evt.data);

	 //            // This is where we will reload the notification data.
	 //            App.Router.appView.notification();
	 //        }
	 //        ws.onclose = function()
	 //        { 
	 //          console.log("Connection is closed..."); 
	 //        }
	 //    }
	 //    else
	 //    {
	 //      console.log("WebSocket NOT supported by your Browser!");
	 //    }
	    this.$el.html("");
	    this.$el.append(this.navTemplate());
	    this.$el.append(this.template());
	    // $('#signin-modal').modal('hide');	
		return this;

	},
	addAll: function() {
		$('#routeList').html('');
		App.routeCollection.each(this.addOne);

	},
	addOne: function(route) {
		var view = new App.View.RouteList({model: route});
		view.bind('editRoute', this.routeModal);
		view.bind('clickMap', this.showMap);
    	$("#routeList").append(view.render().el);
	},
	routeModal: function(view){
		var view = new App.View.AddRoute({model:view.model});
		$('#modalContainer').html('');
		$("#modalContainer").append( view.render().el);
		$('#routeModal').modal();
		if(view.model){
			$('#startState').val(view.model.get('startAddress').state);
			$('#endState').val(view.model.get('endAddress').state);
		}
	},
	filterRoute : function(){
		var keyword = $('#filterKeyword').val();
		var queryStart = new Parse.Query(App.RouteModel);
		var queryEnd = new Parse.Query(App.RouteModel);
		queryStart.contains("strStart", keyword);
		queryEnd.contains("strEnd", keyword);
		var mainQuery = Parse.Query.or(queryStart, queryEnd);
		var temp = App.routeCollection.query;
		App.routeCollection.query = mainQuery;
		App.routeCollection.query.equalTo("user_ptr", Parse.User.current());
		App.routeCollection.fetch({reset:true});
		App.routeCollection.query = temp;
	}	
	
});
