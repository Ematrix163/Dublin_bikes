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

    //Use ajax request to get static data
    let getBikeStation = $.ajax({
        url: './static'
    })

    // change this to

    // let liveData = $.ajax({

//    url: './request?type=LiveData'
//  })

    //If the ajax request success


    //chane this to   getLiveData.done(function (data) { etc......
    getBikeStation.done(function (data) {
    	console.log('Get data successfully!');
        data = JSON.parse(data);
        data.map(station => {
            //Display the marker on the map
            createMarkerInfoWindow(station, largeInfowindow);

            //push current station to all station
            allStations.push(station);
        })
        fitMap();
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


    // create a new circle
    let stationCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: location,
        radius: 50,
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
    infowindow.setContent(
        `<div class='infowindow'>
            <div class='circle-title'>${circle.title}</div>
            <div class='bike'>
                <P>Status: ${station.status}</P>
                <p>Total Bike stands: ${station.bike_stands}</p>
                <p>Available Bike stands: ${station.available_bike_stands}</p>
                <p>Available Bikes: ${station.available_bikes}</p>

            </div>
        </div>`

        // I don't think we need to list the number of bike stands here. It is irrelevant to the user

// add this to give a clickable link through to the dashboard
// <a href = '/dash?stand='+station.number.toString()>View in dashboard</a>

        // add div for the canvas node where the graph will be drawn
    );

    infowindow.open(map);
}



//The function is to alert error
function sweetNote(source) {
    swal({
        type: 'error',
        title: 'Oops',
        text: source
    })
}



function calcRoute(s, e) {


  // How are you getting s and e?

// In the back end I defined, the @app.route('/distance') will find the closest bike station that has an acceptable number of bikes. Can we please just use this method.



	let directionsDisplay = new google.maps.DirectionsRenderer;
	let directionsService = new google.maps.DirectionsService;
	directionsDisplay.setMap(map);

    // First, clear out any existing markerArray
    // from previous calculations.
    for (let i = 0; i < allMarkers.length; i++) {
        allMarkers[i].setMap(null);
    }

    // Retrieve the start and end locations and create
    // a DirectionsRequest using WALKING directions.
    let start = s;
    let end = new google.maps.LatLng(e.lat, e.lng);

    let request = {
        origin: start,
        destination: end,
        travelMode: 'WALKING'
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
			calcRoute(departure, destinationLoc);
		}
	}
}
