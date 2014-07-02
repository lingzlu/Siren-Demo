var App = App || {};

App.View.DashPage = Parse.View.extend({
	template: _.template($('#dash-template').html()),
	className: 'dash',
	tagName: 'div',

	initialize: function(){
		_.bindAll(this, 'render');
	},
	
	render: function() {
		if (!Parse.User.current()){
			App.Router.navigate("", true);
			return false;
		}
		else{
			$("#btnLogOut").click(function() {
				Parse.User.logOut();
				App.Router.appView.refreshNavRight();
				App.Router.appView.notification();
			});
			this.$el.html(this.template({}));
			return this;
		}
	},

	logout : function() {
		Parse.User.logOut();
	}
})