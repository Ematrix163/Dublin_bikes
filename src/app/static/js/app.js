'use strict';


let allStations = [];
let allMarkers = [];
let allCircles = [];
let map, user;
let largeInfowindow;
let userLocation = {lat: 53.345228,lng: -6.272145};
let searchBox;



function getBadGraidentColor(available_bikes, available_bike_stands) {

    let blue = [0, 0, 255];
    let red = [255, 0, 0];
    let color = [0, 0, 0]
    let total = available_bikes + available_bike_stands;


    let bluepart = Math.floor(255 * (available_bikes / total))
    let redpart = Math.floor(255 * (available_bike_stands / total))
    let greenpart = Math.floor(255 * (1 - (Math.abs(available_bikes - available_bike_stands) / total)))
    return '#' + redpart.toString(16) + greenpart.toString(16) + bluepart.toString(16);

}


// function start() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//         sweetNote('your location!')
//         initMap();
//     }
// }


function showPosition(position) {
    userLocation.lat = position.coords.latitude;
    userLocation.lng = position.coords.longitude;
    initMap();
}


function initMap() {

    /*This function is to initialising the map*/
    largeInfowindow = new google.maps.InfoWindow();

    // create new map object
    map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15,
    });



	let getWeather = $.ajax({
		url: './request?type=weather'
	})

	getWeather.done(function(data){
		 data = JSON.parse(data);
		 let w  = data['weather'];
		 $('#temp').text('Temp:' + w['temp']);
		 $('#max-temp').text(w['temp_max']);
		 $('#min-temp').text(w['temp_min']);
		 $('#icon').attr('src', `./static/images/weather/${w['icon']}.png`);
	})



	getWeather.fail(function(){
		sweetNote('Sorry, cannot get weather data!')
	})



    //Use ajax request to get static data
    let getBikeStation = $.ajax({
        url: './request?type=liveData'
    })



    getBikeStation.done(function (data) {
    	console.log('Get data successfully!');
		$('.overlay').hide();
        data = JSON.parse(data);
		for (let i in data) {
			data[i]['number'] = i;
			//Display the marker on the map
			createMarkerInfoWindow(data[i], largeInfowindow);
			//push current station to all station
			allStations.push(data[i]);
		}
        fitMap();
		// knockout library
        ko.applyBindings(new viewModel());
    });

    //If the ajax request fail
    getBikeStation.fail(function (error) {
        //alert
        sweetNote('Sorry, cannot get static data!');
    });


    // Make markers fit the map, this is optional.
    // function fitMap() {
    //     let bounds = new google.maps.LatLngBounds();

    //     for (let eachMark of allMarkers) {
    //         eachMark.setMap(map);
    //         bounds.extend(eachMark.position);
    //     }
    //     map.fitBounds(bounds);
    // }


    let input = document.getElementById('userLocation');
    searchBox = new google.maps.places.SearchBox(input);




    // This function is to make all circles fit the map
    function fitMap() {
        let bounds = new google.maps.LatLngBounds();
        allCircles.map(circle => {
            circle.setMap(map);
            bounds.union(circle.getBounds())
        })
        map.fitBounds(bounds);
    }



    // This marker is to show markthe user location
    user = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: userLocation
    });
}




function createMarkerInfoWindow(station, infowindow) {

    let location = {
        lat: station.lat,
        lng: station.long
    };
    /*new marker object， i'm not sure should we use marker so I just comment it*/
    // let marker = new google.maps.Marker({
    //     map: map,
    //     title: station.name,
    //     animation: google.maps.Animation.DROP,
    //     position: location,
    //     id: station.number
    // });
    if (station.bikes > station.spaces + 5){
      var color = 'red';
    }
    else if (station.bikes + 5 < station.spaces){
      var color = 'blue';
    }
    else{
      var color = 'green';
    }

    // create a new circle
    let stationCircle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
  //'blue' if station.available_bikes > station.available_bike_stands
  //else: 'red'
        fillOpacity: 0.35,
        map: map,
        center: location,
        radius: 15* Math.sqrt(Math.max(Math.abs(station.bikes - station.spaces), 1)),   //radius:10 math.sqrt(max(abs(station.available_bikes - available_stands), 1), 2) * 50
        clickable: true,
        title: station.name
    })

    // allMarkers.push(marker);
    allCircles.push(stationCircle);
    //    google.maps.event.addListener(stationCircle, 'click', function(ev){
    //        infowindow.setPosition(ev.latLng);
    //        infowindow.setContent('<div>' + stationCircle.title + '</div>');
    //        infowindow.open(map);
    //    });

    // add event listener to the circle object when user click the circle
    google.maps.event.addListener(stationCircle, 'click', function (ev) {
        populateInfoWindow(this, largeInfowindow, ev, station);
    });

    // //binding click event with marker
    // stationCircle.addListener('click', function () {
    //     populateInfoWindow(this, largeInfowindow)
    // });
}


function populateInfoWindow(circle, infowindow, ev, station) {

    /*This function is to populate infowindow when user click*/
    infowindow.setPosition(ev.latLng);

	var date = new Date(station.time);
    infowindow.setContent(
        `<div class='infowindow'>
			<div class="chart-container">
				<canvas id="chart${station.number}"></canvas>
			</div>
            <div class='circle-title'>${circle.title}</div>
            <div class='bike'>
                <P>Status: ${station.status}</P>
                <p>Available Bike stands: ${station.spaces}</p>
                <p>Available Bikes: ${station.bikes}</p>
                <p><a href="/dash?stand=${station.number}">View on Dash</a></p>
				<p>Last Update Time: ${date}</p>
            </div>
        </div>`
    );
    infowindow.open(map);
	let today = new Date();
	let week = today.getDay();
	loadChart(station.number, week, false, station.number);
}



//The function is to alert error
function sweetNote(source) {
    swal({
        type: 'error',
        title: 'Oops',
        text: source
    })
}



function calcRoute(s, e, mode = 'WALKING') {
  // How are you getting s and e?

// In the back end I defined, the @app.route('/distance') will find the closest bike station that has an acceptable number of bikes. Can we please just use this method.


	let directionsDisplay = new google.maps.DirectionsRenderer;
	let directionsService = new google.maps.DirectionsService;
	directionsDisplay.setMap(map);

    // First, clear out any existing markerArray
    // from previous calculations.
    for (let i = 0; i < allCircles.length; i++) {
        allCircles[i].setMap(null);
    }

    // Retrieve the start and end locations and create
    // a DirectionsRequest using WALKING directions.
    let start = new google.maps.LatLng(s.lat, s.lng);
    let end = new google.maps.LatLng(e.lat, e.lng);

    let request = {
        origin: start,
        destination: end,
        travelMode: mode
    };

    // Route the directions and pass the response to a
    // function to create markers for each step.


    directionsService.route(request,
		function (response, status) {
        if (status == "OK") {
            directionsDisplay.setDirections(response);
        } else {
			sweetNote('Sorry, cannot get a route!')
		}
    });
}








/*MVVM binding*/
/*Knockout library is used here*/
let place = function (data) {
    this.name = ko.observable(data.name);
    this.id = ko.observable(data.number);
}


let viewModel = function() {
    let self = this;

    this.keyword = ko.observable('');
    this.placeList = ko.observableArray([]);

	// this.inputValue = ko.observable('1');

    this.placeList = ko.computed(function(){
        let temp = [];
        allStations.map(station => {
            let lowerPlace = station.name.toLowerCase();
            if (lowerPlace.includes(self.keyword().toLowerCase())) {
                temp.push(new place(station));
            }
        });
         return temp;
    })

	// When user click a tag, fillout the tag on the blank
	this.displayInfo = function(item, event) {
		self.keyword(item.name());

		allCircles.map(circle => {
            let lowerCase = circle.title.toLowerCase();
            if (lowerCase.includes(self.keyword().toLowerCase())) {
                circle.setMap(map);
            } else {
                circle.setMap(null);
            }
        })
	}

    this.fliterStands = function(data, event){
        allCircles.map(circle => {
            let lowerCase = circle.title.toLowerCase();
            if (lowerCase.includes(data.keyword().toLowerCase())) {
                circle.setMap(map);
            } else {
                circle.setMap(null);
            }
        })
    }



	this.show = function(data, event) {
		if (!searchBox.getPlaces()) {
			sweetNote('Please input your location!');
		} else if (! self.keyword()) {
			sweetNote('Please input your chosen bike stands!');
		} else {
			let departure = searchBox.getPlaces()["0"].geometry.location;
			let destination = self.keyword();
			let destinationLoc = {};
			for (let station of allStations) {
				let lowerCase = station.name.toLowerCase();
				if (lowerCase.includes(destination.toLowerCase())) {
					destinationLoc['lat'] = station.lat;
					destinationLoc['lng'] = station.long;
					break;
				}
			}
			calcRoute({'lat':departure.lat(),'lng':departure.lng()}, destinationLoc);
		}
	}


	this.findBike = function(data, event) {
		$('#loading-text').text('Try to find the nearest bike for you...');
		$('.overlay').show();
		let getBike = $.ajax({
			url: './distance',
			type: 'GET',
			data: {'origin': userLocation}
		});
		getBike.done(function(data) {
			$('.overlay').hide();
			data = JSON.parse(data);
			data['lng'] = data['long'];
			calcRoute(userLocation, data);
		})
		getBike.fail(function(data){
			sweetNote('Sorry, the server cannot find a bike for you!')
		});
	}


	this.findStation = function(data, event) {


		$('#loading-text').text('Try to find the nearest availabe station for you...');
		$('.overlay').show();
		let getStation = $.ajax({
			url: './distance',
			type: 'GET',
			data: {'origin':userLocation, 'mode':'bicycling'}
		})

		getStation.done(function(data){
			$('.overlay').hide();
			data = JSON.parse(data);
			data['lng'] = data['long'];
			calcRoute(userLocation, data);
		})

		getStation.fail(function(data){
			sweetNote('Sorry, the server cannot find a station for you!')
		});
	}




}
