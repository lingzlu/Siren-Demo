/* 
 * Router.js 
 * Responsible for rendering different views with response to user actions.
 */
 var App = App || {};

 var AppRouter = Parse.Router.extend(
 {
 	routes:
 	{
 		"" : "homePage",
 		"dash" : "dashPage",
 		"Route" : "routePage",
 		"About" : "aboutPage",
 		"Route/:id" :"mapPage"

 		// Attach more URLs here
 	},

 	initialize : function()
 	{
 		this.appView = new App.AppView();
 	},

 	homePage : function()
 	{
		this.appView.homePage();
 	},

 	dashPage : function()
 	{
		this.appView.dashPage();
 	},

 	mapPage : function(id)
 	{	
 		this.appView.mapPage(id);
 	},

 	routePage : function()
 	{
 		this.appView.routePage();
 	},

 	aboutPage : function()
 	{
 		this.appView.aboutPage();
 	}

 	// Attach more pages/view here

 });

// Execute router
// true for hashless nav, requires serverside support
App.Router = new AppRouter();
Parse.history.start(
{
	pushState: false
});

// Router fix so that internal links do not all have to begin with hashes
$(document).on("click", "a[href^='/']", function(evt) 
{
	var href = $(this).attr('href');
	var protocol = this.protocol + '//';

	if (href.slice(protocol.length) !== protocol) 
	{
 		evt.preventDefault();
  		App.Router.navigate(href, true);
	}
});