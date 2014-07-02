var App = App || {};

App.Socket = 
{

	// host : "ws://54.243.63.41/notification",
	socket: null,
	connect : function (map)
	{  
		try
		{  
			
			this.socket = new WebSocket(this.host);  

			this.socket.onopen = function()
			{  
				// console.log("Connecting");
				// console.log(user_id);
				this.send(Parse.User.current());
			}

			this.socket.onmessage = function(msg)
			{  
				arr = msg.data.split(',');
				if (arr[0] == 'header:GPS_Position')
				{
					for (i = 1; i < arr.length; i++)
					{
						gps_data = arr[i].split(':');
						console.log("Route "+ gps_data[0] + " is at:" + gps_data[1] + "," + gps_data[2]);
						//gps values
						//gps_data[0] route_id
						//gps_data[1] lat 
						//gps_data[2] lon
						// updating route model's current lat, lon
						// App.routeCollection.query = new Parse.Query(App.RouteModel);
						// App.routeCollection.query.equalTo("user_ptr", Parse.User.current());

						// App.routeCollection.fetch({
						// 	success:function(routes){
						// 		routes.each(function(route){
						// 			route.set("position", {lat: gps_data[1], lng: gps_data[2]});
						// 			route.save();
						// 		});
						// 	}
						// });
						
						// var route = map.model;
						// console.log(route)
						// route.set("position", {lat: gps_data[1], lng: gps_data[2]});
						// var latLng = route.get('position');
						var currentPosition = new google.maps.LatLng(gps_data[1], gps_data[2]);
						map.updateMarker(currentPosition);
		
					}
				}
				else if (arr[0] == 'header:Pull_Request')
				{
					//updating notification and routes
					App.routeCollection.each(function(route){
						route.save();
					});
					App.Router.appView.notification();

				}
				else if (arr[0] == 'header:Risk_Factor')
				{
					response = arr[1].split(':')
					if (response[1] == 'Success')
					{
						console.log('risk factor ready for id: '+ response[0]);

						//wait for the rating factor
					}
					else
					{
						console.log('failed to compute the risk factor: '+ response[0]);
					}
				}

			}  

			this.socket.onclose = function()
			{  
				console.log("Connection is closed...");
			}  
		} 
		catch(exception)
		{  
			console.log("Error: " + exception); 
		}  
	},

	send : function(route_id)
	{
		try
		{
			this.socket.send(route_id);
		}
		catch (exception)
		{
			console.log("Error: " + exception);
		}
	}
}