/* 
 * appView.js 
 * 
 */
  var App = App || {};


App.AppView = Parse.View.extend(
{
 	el: "#content-div",

 	events:
 	{
  
 	},

 	initialize : function()
 	{
 		//Bind this to be "this"
    App.routeCollection.query = new Parse.Query(App.RouteModel);
    App.routeCollection.bind('add', this.notification);
    App.routeCollection.bind('remove', this.notification);
    Parse.history.bind('all', function(route, router){
      clearInterval(onAnimation);
    });

 		this.navLinks = $('#nav-links');


    $("#inputPassword2").complexify( {}, function (valid, complexity){
        
          $('#password-strength').attr('aria-valuenow', Math.round(complexity));
          $('#password-strength').attr('style', "Width: " + Math.round(complexity) +"%");
          if (complexity < 20)
          {
            $('#password-strength').removeClass('progress-bar-success');
            $('#password-strength').removeClass('progress-bar-warning');
            $('#password-strength').addClass('progress-bar-danger');
          }
          else if (complexity < 40)
          {
            $('#password-strength').removeClass('progress-bar-danger');
            $('#password-strength').removeClass('progress-bar-success');
            $('#password-strength').addClass('progress-bar-warning');
          }  
          else
          {
            $('#password-strength').removeClass('progress-bar-danger');
            $('#password-strength').removeClass('progress-bar-warning');
            $('#password-strength').addClass('progress-bar-success');
          }

    });
    
    $("#reinputPassword2").keyup(function() {
      if ($("#reinputPassword2").val() != $("#inputPassword2").val())
      {
        $("#reinputPassword2").removeClass('right-input');
        $("#reinputPassword2").addClass('wrong-input');
      }
      else 
      {
        $("#reinputPassword2").removeClass('wrong-input');
        $("#reinputPassword2").addClass('right-input');
      }
    });
    

    $("#signup-modal-btn").click(function (){

      $("#signin-modal").modal('hide');

    });

    
 	},

 	refreshNavRight : function(){
 		var loginView = new App.View.Nav(); 
 		$("#navbar-right").html(loginView.render().el);
    $("#btnLogIn").click(loginView.logIn);
    $("#btnSignUp").click(loginView.signUp);
    $("#btnLogOut").click(loginView.logOut);

 	},
  notification :function(){
    console.log("notification called");
    App.badRoutes.query = new Parse.Query(App.RouteModel);
    App.badRoutes.query.equalTo("user_ptr", Parse.User.current());
    App.badRoutes.query.greaterThan('maxRating', 70);
    if(Parse.User.current()){
      App.badRoutes.fetch({
        success:function(routes){
          var notificationView = new App.View.Notification({badRoutes:routes});
          $("#notificationHolder").html(notificationView.render().el);
          if(routes.length > 0)
            $(".badge").addClass("red"); 
          else
            $(".badge").removeClass("red"); 
        }
      });
    }
    else{
      $("#notificationHolder").html("");
    }
  },

 	clearActiveNavLink: function() 
 	{
		this.navLinks.find('li').removeClass('active');
	},

	highlightNavLink: function(navlink) 
	{
		var selector = 'li[data-page='+navlink+']';
		this.navLinks.find(selector).addClass('active');
	},

 	homePage : function()
 	{
 		this.clearActiveNavLink();
 		this.$el.html( (new App.View.HomePage()).render().el );
    this.refreshNavRight(); 
    this.notification();
  },

	dashPage : function()
	{
		this.clearActiveNavLink();
    this.refreshNavRight();
    this.notification();
		this.$el.html( (new App.View.DashPage()).render().el );
	},

 	mapPage : function(id)
 	{
 		this.clearActiveNavLink();
    App.Socket.connect(id);
    var me = this;
    App.routeCollection.fetch({
      success:function(){
        var theModel = App.routeCollection.get(id);
        var view = new App.View.MapView({model:theModel});
        me.$el.html( view.render().el);
        view.activate();
        App.Router.appView.notification();
        App.Socket.connect(view);
        <!-- notification for map page -->
        App.badRoutes.query = new Parse.Query(App.RouteModel);
        App.badRoutes.query.equalTo("user_ptr", Parse.User.current());
        App.badRoutes.query.greaterThan('maxRating', 70);
        if(Parse.User.current()){
          App.badRoutes.fetch({
            success:function(routes){
              var notificationView = new App.View.Notification({badRoutes:routes});
              $("#mapNotification").html(notificationView.render().el);
              if(routes.length > 0)
                $(".badge").addClass("red"); 
              else
                $(".badge").removeClass("red"); 
            }
          });
        }
        else{
          $("#mapNotification").html("");
        }
      }
    });
 		this.highlightNavLink('map');
 	},

 	routePage : function(flag)
 	{
    if (Parse.User.current() || flag){
   		this.clearActiveNavLink();
   		var view = new App.View.RoutePage();
   		this.$el.html( view.render().el);
      // $('#ratingPopover').popover({content: "This number represents the road coditions of this route from 1 - 100"});
   		this.highlightNavLink('route');
    }
    else{
      $("#signin-modal").modal('show');
      $('#alertLogIn').show();
      $('#alertSignUp').hide();
      $('#alertLogIn').html("Please log in to access your routes")
    }
    this.refreshNavRight(); 
    this.notification();
 	},

 	aboutPage: function()
 	{
 		this.clearActiveNavLink();
 		var view = new App.View.About();
 		this.$el.html( view.render().el);
    this.refreshNavRight(); 
    this.notification();
 		this.highlightNavLink('about');
 	}

 	// Attach views here
 });