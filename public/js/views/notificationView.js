var App = App || {};

App.View.Notification = Parse.View.extend({
	tagName: 'li',
	className: 'dropdown',
	template: _.template($('#notification-template').html()),
	events: {

	},
	initialize: function() {
	},

	render: function() {
		this.$el.html(this.template(this.options));
		return this;
	},
});
