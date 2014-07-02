var App = App || {};


App.View.RouteList = Parse.View.extend({

	className: 'routeRow list-group-item',
	tagName: 'li',
	template: _.template($('#route-list-template').html()),
	events: {
		"click .clickToMap:not(.editRoute)" : "showMapPage",
		"click .editRoute" : "selectEdit",
		"click .destroyRoute" : "destroy"
	},
	initialize: function() {
		_.bindAll(this, 'render');
		this.model.bind('change', this.render);
		this.model.bind('change', this.triggerNotification);
	},

	render: function() {
		this.$el.html(this.template(this.model));
		if (this.model.attributes.maxRating[0] > 69){
			this.$(".route-icon").css("background-color", "#D7191C");
			this.$(".route-number").css("color", "#D7191C");
		}
		else if (this.model.attributes.maxRating[0] > 40){
			this.$(".route-icon").css("background-color", "#FDAE61");
			this.$(".route-number").css("color", "#FDAE61");	
		}
		return this;
	},
	selectEdit: function(event){
		event.stopImmediatePropagation();
		this.trigger("editRoute", this);
	},
	showMapPage: function(){
		var href = this.model.routeURL();
		App.Router.navigate(href, {trigger: true});
	},
	destroy: function(event){
		event.stopImmediatePropagation();
		this.model.destroy();
	},
	triggerNotification : function(){
		App.Router.appView.notification();
	}

});
