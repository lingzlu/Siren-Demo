var App = App || {};
App.View.HomePage = Parse.View.extend({
	navTemplate: _.template($('#main-nav-template').html()),
	template: _.template($('#home-template').html()),
	className: 'home',
	tagName: 'div',

	events: {
		
	},

	render: function()
	{ 

		// if (Parse.User.current() !== null){
		// 	App.Router.navigate("dash", true);
		// 	return false
		// }
		// else{
		// 	this.$el.html(this.template({}));
		// 	return this;
		// }
		this.$el.html("");
		this.$el.append(this.navTemplate());
		this.$el.append(this.template());
		return this;
	}
});
