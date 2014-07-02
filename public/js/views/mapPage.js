var App = App || {};

var directionsDisplay;
var directionsService;
var map;
var oldDirections = [];
var currentDirections = null;
var marker;
var onAnimation;
var infoWindow = new google.maps.InfoWindow();
App.View.MapView = Parse.View.extend({
	className: 'mapContainer',
	tagName: 'div',
	navTemplate: _.template($('#map-nav-template').html()),
	template: _.template($('#map-page-template').html()),
	events: {

	},
	initialize: function() {

	},
	render: function() {
		this.$el.html("");
		this.$el.append(this.navTemplate());
		this.$el.append(this.template());
		return this;
	},
	activate: function(){
		$('#directions_panel').mouseover(function(){
		 	$('#directions_panel').stop().animate({marginRight: '0px'}, 300);
		}).mouseout(function(){
		  	$('#directions_panel').stop().animate({marginRight: '-29%'}, 300);
		});
		var mapOptions = {
			zoom: 13,
			center: new google.maps.LatLng(35.187, -97.438),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var mapContainer = this.$('#map_canvas');
		map = new google.maps.Map(mapContainer.get(0),mapOptions);
		directionsService = new google.maps.DirectionsService();

		var polylineOptions = {
			strokeColor: '#ABD9E9',
			strokeWeight: 5
		}

		directionsDisplay = new google.maps.DirectionsRenderer({
			'map': map,
			'preserveViewport': false,
			'draggable': false,
			'polylineOptions': polylineOptions
		});

		var panel = this.$("#directions_panel").get(0);
		directionsDisplay.setPanel(panel);

		google.maps.event.addListener(directionsDisplay, 'directions_changed',
			function() {
				if (currentDirections) {
					oldDirections.push(currentDirections);
				}
				currentDirections = directionsDisplay.getDirections();
		});
		var strStart = this.model.get('strStart');
		var strEnd = this.model.get('strEnd');
		var me = this;

		var request = {
			origin : strStart,
			destination : strEnd,
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		};

		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
				setTimeout(function(){
					// this.$(".adp-directions td:nth-child(2)").addClass("ratingBox2");
					me.simulation(result);
				},0.1);
			}
		});
	}, 

	simulation: function(result){
		var polyline = new google.maps.Polyline({
		  path: [],
		  strokeColor: '#71BC78',
		  strokeWeight: 4
		});

		var bounds = new google.maps.LatLngBounds();
		var legs = result.routes[0].legs;
		var steps = legs[0].steps;

		marker = new google.maps.Marker ({
			position: legs[0].start_location,
			map:map,
			icon: "img/truck_icon.png"
		});

		var nodes=directionsDisplay.getPanel().querySelectorAll('.adp-directions td:nth-child(2)');
		var hazard = false;
		for(i=0;i<nodes.length;i++){
			var rating = Math.floor((Math.random()*30)+1);
			nodes[i].innerHTML = "<div class=\"ratingBox2\">"+rating+"<\/div>";
			if(i == 15){
				if(this.model.get('rating') > 70){
					nodes[i].innerHTML = "<div class=\"ratingBox2 red\">"+this.model.get('rating')+"<\/div>";
					hazard = true;
				}
			}
		}
		
		// $(".adp-directions td:nth-child(2)").filter(function(index){
		// 	return this.innerHTML > 70;
		// }).addClass("red");
		// $(".adp-directions td:nth-child(2)").filter(function(index){
		// 	return (this.innerHTML > 40 && this.innerHTML < 70);
		// }).addClass("orange");

		for (i=0;i<steps.length;i++) {
			var nextSegment = steps[i].path;

			for (j=0;j<nextSegment.length;j++) {
				polyline.getPath().push(nextSegment[j]);
				bounds.extend(nextSegment[j]);
				if(hazard){
					if(i == 15){
						dangerPolyline.getPath().push(nextSegment[j]);
					}
				}

			}
		}
		// polyline.setMap(map);
		map.fitBounds(bounds);
		this.dividingPolyline(polyline.getPath(), 10);
		this.movingMarker(polyline.getPath());
	},
	dividingPolyline:function(polyline, miles){
		var me = this;
		var distance = 0;
		var index = 0;
		var segPath = []; 
		var lengthInMeter = miles*1609.344;
		var segment;
		var polyData = this.model.get('segments');
		var dataCounter = 0;
		var color;
		while(index < polyline.length - 3){
			distance += google.maps.geometry.spherical.computeDistanceBetween(polyline.getArray()[index], polyline.getArray()[index+3]);
			segPath.push(polyline.getArray()[index+3]);
	
			if(distance >= lengthInMeter){
			
				if(polyData[dataCounter][2] > 69){
					color = "#D7191C";
				}
				else if(polyData[dataCounter][2] > 40)
					color = "#FDAE61";
				else
					color = "#71BC78";

				segment = new google.maps.Polyline({
				  path: segPath,
				  strokeColor: color,
				  strokeWeight: 5
				});
				segment.setMap(map);
				var condMsg = "<p><em>Road Condition Safe, Have a Good Trip!</em></p>";
				var style = "";
				if(polyData[dataCounter][2] > 69){
					condMsg = "<p style='color:red' ><em>ALARM: Severe Snow Storm Ahead!!</em></p>"
					style = "style='background-color: #D7191C'";
				}else if(polyData[dataCounter][2] > 40){
					condMsg ="<p style='color:orange'><em>WARNING: Bad Weather in Progress,<br> Proceed With Caution!</em></p>"
					style = "style='background-color: #FDAE61'";
				}
				else{
					style = "style='background-color:#71BC78'";
				}

				var contentDom = 
				"<h4 style='text-decoration:underline;'>Current Weather Info</h4>"+
				"<div class='col-md-8'>" +
					"<h4>Rating: " + polyData[dataCounter][2]+ "</h4>" +
					"<p>"+condMsg + "</p>" +
				"</div>" +
				"<div class='col-md-4'>" +
					"<p class='mapIcon'" + style + ">" +
						polyData[dataCounter][3] +
					"</p>"
				"</div>";

				// geocoder.geocode({'latLng': points.getArray()[index]}, function(results, status) {
				// 	if (status == google.maps.GeocoderStatus.OK) {
				// 		if (results[1]) {
				// 			var locationName = results[1].formatted_address;
				// 		}
				// 	} else {
				// 		alert("Geocoder failed due to: " + status);
				// 	}
				// });
		
				me.segmentWindowEvent(map, segment,contentDom);
				segPath = [];
				segPath.push(polyline.getArray()[index+3]);
				distance = 0;
				dataCounter++;
			}
			index+=3;
		}
	},
	segmentWindowEvent: function(map, segment, content){
		google.maps.event.addListener(segment, 'click', function(event){
			infoWindow.setPosition(event.latLng);
			infoWindow.setContent(content);
			infoWindow.open(map);
		});
	},
	updateMarker:function(latLng){
		marker.setPosition(latLng);
	},
	movingMarker:function(points){
		var me = this;
		var index = Math.round(points.length/3);
		var geocoder = new google.maps.Geocoder();
		// console.log(me.model.get('position'));
		marker.setPosition(points.getArray()[index]);
		onAnimation = setInterval(function(){
			
			// var latLng = me.model.get('position');
			// var currentPosition = new google.maps.LatLng(latLng.lat, latLng.lng);
			// marker.setPosition(currentPosition);

			marker.setPosition(points.getArray()[index]);

			index++;
			console.log("running");
			if(index > points.length){
				clearInterval(onAnimation);
			}
		},1000);
	}

	// for(var step = 0; step < steps.length; step++)
	// {
	// 	polylineOptions = {
	// 		map: map,
	// 		strokeColor: "#FF0000",
	// 		strokeOpacity: 0.7,
	// 		strokeWeight: 5,
	// 		path: steps[step].lat_lngs,
	// 	}
	// 	new google.maps.Polyline(polylineOptions);
	// }

});
