var App = App || {};
var objStart = {};
var objEnd ={};
var strStart, strEnd;
var segPath;

App.View.AddRoute = Parse.View.extend({

	template: _.template($('#route-modal-template').html()),
	events: {
		"click #submitRoute": "processInputs",
		"click .deleteRoute": "removeRoute"
	},
	initialize: function() {
		_.bindAll(this, 'processInputs','updateRoute', 'checkAddress');	
	},

	render: function() {	
		if(this.model != null){
			this.$el.html(this.template({route : this.model}) );
		}
		else{
			this.$el.html(this.template({route : null}));
		}
		return this;
	},
	processInputs: function(){

		objStart.address1 = this.toTitleCase(this.$el.find('input[name=startAddress1]').val());
		objStart.address2 = this.toTitleCase(this.$el.find('input[name=startAddress2]').val());
		objStart.city = this.toTitleCase(this.$el.find('input[name=startCity]').val());
		objStart.state =  $('#startState :selected').val();
		objStart.zip= this.$el.find('input[name=startZip]').val();

		objEnd.address1 = this.toTitleCase(this.$el.find('input[name=endAddress1]').val());
		objEnd.address2 = this.toTitleCase(this.$el.find('input[name=endAddress2]').val());
		objEnd.city = this.toTitleCase(this.$el.find('input[name=endCity]').val());
		objEnd.state =  $('#endState :selected').val();
		objEnd.zip= this.$el.find('input[name=endZip]').val();

		strStart = objStart.address1 + " " + objStart.address2 + " " + objStart.city
									+ " " +objStart.state + " " + objStart.zip;
		strEnd = objEnd.address1 + " " + objEnd.address2 + " " + objEnd.city
									+ " " +objEnd.state + " " + objEnd.zip;

		if(objStart.address1 == "" || objStart.city =="" || objStart.state==""){
			alert("PLEASE FILL OUT THE REQUIRED FIELDS FOR START LOCATION")
		}
		else if(objEnd.address1 == "" || objEnd.city =="" || objEnd.state==""){
			alert("PLEASE FILL OUT THE REQUIRED FIELDS FOR END LOCATION")
		}
		else{
			this.checkAddress(strStart, strEnd);
		}				
		return false;
	},
	checkAddress: function(start, end){
		var me = this;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'address':start ,'region':'usa'}, function(results1, status1){
			if (status1 == google.maps.GeocoderStatus.OK) {
				geocoder.geocode({'address':end, 'region':'usa'}, function(results2, status2){
					if (status2 == google.maps.GeocoderStatus.OK) {
						me.getPolyline();
					}
					else
						alert("Please double check end address.")
				});
			} 
			else{
				alert("Please double check start address.");
			} 
		});
	},
	updateRoute: function(){
		var rating = Math.floor((Math.random()*100)+1);
		var alarm = false;
		if (rating > 69)
			alarm = true;
		if(this.model==null){
			App.routeCollection.create({
				user_ptr : Parse.User.current(),
				startAddress: objStart,
				endAddress: objEnd,
				strStart : strStart,
				strEnd : strEnd,
				rating: rating,
				segments : segPath,
				alarm : alarm
			});
		}	
		else{
			this.model.save({
				startAddress : objStart,
				endAddress : objEnd,
				strStart : strStart,
				strEnd : strEnd,
				segments : segPath
			});
		}
		$('#routeModal').modal('hide');
	},
	removeRoute: function(){
		this.model.destroy();
		$('#routeModal').modal('hide');
		return false;
	},
	getPolyline:function(){
		var me = this;
		var path = [];
		var directionsService = new google.maps.DirectionsService();
		var request = {
			origin : strStart,
			destination : strEnd,
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		};

		directionsService.route(request, function(result, status) { 
			if (status == google.maps.DirectionsStatus.OK) {
				var legs = result.routes[0].legs;
				var steps = legs[0].steps;
				for (i=0;i<steps.length;i++) {
					var nextSegment = steps[i].path;
					for (j=0;j<nextSegment.length;j++) {
						path.push(nextSegment[j]);
					}
				}
			}
			me.dividingPolyline(path,10);
			me.updateRoute();
		});
	},
	dividingPolyline:function(path, miles){
		var me = this;
		var distance = 0;
		var index = 0;
		segPath = this.model.get('segments');
		var lengthInMeter = miles*1609.344;
		var counter = 0;
	
		while(index < path.length - 3){
			distance += google.maps.geometry.spherical.computeDistanceBetween(path[index], path[index+3]);
			
			if(distance >= lengthInMeter){
				if(counter >= 17 && counter < 20){
					segPath[counter][2] = 84;
					segPath[counter][3] = 'P';
				}
				else if(counter > 14 && counter < 17){
					segPath[counter][2] = 43;
					segPath[counter][3] = 'W';
				}
				else if(counter == 20 || counter== 21 || counter == 35 || counter == 65|| counter == 55|| counter == 45|| counter == 71|| counter == 36|| counter == 37)
				{	
					segPath[counter][2] = 47;
					segPath[counter][3] = 'R';
				}
				else
					segPath[counter][2] = -1;
			
				distance = 0;
				counter ++;
			}
			index+=3;
		}

	},
	toTitleCase:function(str){
		return str.replace(/\w\S*/g, function(txt){
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

});
