var App = App || {};

App.View.Nav = Parse.View.extend(
{
	tagName: 'a',
	className: 'navbar-text pull-right',
	id: "navbar-right",
	template: _.template($("#nav-template").html()),
	
	events: {
		"click #btnModal" : "prepModal"
	},

	initialize: function(){
		_.bindAll(this, 'render');
	},

	render: function(){
		current_user = Parse.User.current();
		if (current_user)
		{
			this.template = _.template($("#just-work").html());
			this.$el.html(this.template({username: current_user.get('email')}));
		}
		else
		{
			this.$el.html(this.template());
		}
		return this;
	},

	prepModal: function() {
		$('#alertLogIn').hide();
		$('#alertSignUp').hide();
		$('#signin-modal').modal('show');
	},

	logIn: function()
	{
		if ($("#inputEmail").val() == "" || $('#inputPassword1').val() == "")
		{
			$('#alertLogIn').html("Please enter your Username or Password");
			$('#alertLogIn').show();
			return false;
		}
		else
		{
			Parse.User.logIn($('#inputEmail').val(), $('#inputPassword1').val(), {
				success : function(user) {
					$('#signin-modal').modal('hide');
					App.Router.appView.refreshNavRight();
					App.Router.appView.notification();
					App.Router.navigate("/Route", true);
					// $('body').removeClass('modal-open');
					// $('.modal-backdrop').remove();
				},
				error : function(user, error) {
					$('#alertLogIn').html("Server Error. Please Try Again");
					$('#alertLogIn').show();	
				}
			});
			return false;
		}
	},

	signUp: function()
	{
		if ($("#inputUsername2").val() == "" || $("#inputEmail1").val() == "" || $('#inputPassword2').val() == "" || $('#inputPassword2').val() != $('#reinputPassword2').val()){
			$('#alertSignUp').html("Improper Information");
			$('#alertSignUp').show();
			return false;
		}
		else 
		{
			var user = new Parse.User();
			user.set("username", $('#inputEmail1').val().trim());
			user.set("email", $('#inputEmail1').val());
			user.set("password", $('#inputPassword2').val());
			console.log(user.get('username'));
			console.log(user.get('email'));
			console.log(user.get('password'));

			user.signUp(null, {
				success: function(user) {
					$('#signup-modal').modal('hide');
					// $('body').removeClass('modal-open');
					// $('.modal-backdrop').remove();
					App.Router.appView.refreshNavRight();
					App.Router.navigate("Route", true);				
				},
				error: function(user, error) {
					$('#alertSignUp').html("Server Error. Please Try Again");
					$('#alertSignUp').show();
					console.log("SignUp error: " + user + error);
				}
			});
			return false;
		}
	},
	logOut: function(){
		Parse.User.logOut();
		App.Router.appView.refreshNavRight();
		App.Router.appView.notification();
	}
});