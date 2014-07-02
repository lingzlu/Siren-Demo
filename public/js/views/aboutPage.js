var App = App || {};


App.View.About = Parse.View.extend({
	navTemplate: _.template($('#main-nav-template').html()),
	template: _.template($('#about-page-template').html()),
	events: {
		'click .about li': 'selected'
	},
	initialize: function() {

	},

	render: function() {
		this.$el.html("");
		this.$el.append(this.navTemplate());
		this.$el.append(this.template());
		return this;
	},
	selected: function(event){
		$('.about li').removeClass('active');
		$('.aboutContents div').each(function(){
			$(this).hide();
		});
		$(event.currentTarget).addClass('active');
		var target = $(event.currentTarget).text();

		if(target == "About Us")
			$('.aboutUs').show();
		else if(target == "Team")
			$('.team').show();
		else if(target == "Contact")
			$('.contact').show();

		return false;
	}

});
