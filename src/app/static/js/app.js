'use strict';


let predictive_directions = false
var bikeLayer
let allStations = [];
let allMarkers = [];
let allCircles = [];
let map, user;
let largeInfowindow;
let userLocation = {lat: 53.3083,lng: -6.2236};
let searchBox;
let foundUserLocation = false;
let hide_bike_layer=false;
$('#bikeLayerCheckBox').prop('checked', false);


let useAddress = true;
$('#userLocation').hide()
$('#locationWarning').hide()
getLocation()

function showSearch(){
 $('#userLocation').show()
 $('#showSearchButton').hide()
 useAddress = true;
}

function showHideBikeLayer(checkbox){
  console.log('something happened')
  if (checkbox.checked==true){
  	bikeLayer.setMap(map)
  }
  else{
  	bikeLayer.setMap(null)
  }
}

// html geolocate copied from stack overflow
function showError(error) {
  foundUserLocation = false;
  console.log('Could not locate user using geolocate')
let userLocation = {lat: 53.3083,lng: -6.2236};
$('#userLocation').show()
 $('#showSearchButton').hide()
  $('#locationWarning').show()
    switch(error.code) {
        case error.PERMISSION_DENIED:

            break;
        case error.POSITION_UNAVAILABLE:

            break;
        case error.TIMEOUT:

            break
        case error.UNKNOWN_ERROR:
            
            break;
    }

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

//this is from github. The full method is below. Sourced from https://gist.github.com/tbranyen/62d974681dea8ee0caa1







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
    foundUserLocation = true;
    console.log('found user location')
    useAddress=false;

}


function initMap() {

    /*This function is to initialising the map*/
    largeInfowindow = new google.maps.InfoWindow();

    // create new map object
    map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15,
    });

    bikeLayer = new google.maps.BicyclingLayer();

	let getWeather = $.ajax({
		url: 'http://api.openweathermap.org/data/2.5/weather?q=Dublin,Irl&units=metric&APPID='+ apikey
	})

	getWeather.done(function(data){
    console.log(data)

		 let w  = data['main'];
		 $('#temp').text(w['temp']);
		 $('#max-temp').text(w['temp_max']);
		 $('#min-temp').text(w['temp_min']);
     //this method for getting a weather icon, and the icons it displays, were sourced from https://gist.github.com/tbranyen/62d974681dea8ee0caa1
     var prefix = 'wi-';
     var code = data.weather[0]['id'];
     var icon = weatherIcons[code].icon;
     if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
    icon = 'day-' + icon;
  }
    icon = prefix + icon;
		 $('#icon').attr('src', `./static/images/svg/${icon}.svg`);
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
		$('.overlay').hide();
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
      var color = ' #00FF00';
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
        radius: 15* Math.sqrt(Math.max(Math.abs(station.bikes - station.spaces), 10)),   //radius:10 math.sqrt(max(abs(station.available_bikes - available_stands), 1), 2) * 50
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
    /*This function is to populate infowindow when the user clicks on a marker*/
    infowindow.setPosition(ev.latLng);

	let date = new Date(station.time);
	let hour = date.getHours();
	let min = date.getMinutes()
	console.log(hour);
	date = hour + ':' + min;

    infowindow.setContent(
        `<div class='infowindow'>
			<div class="chart-container">
      			<div class="chartoverlay">
					<div class="loading-wrapper">
						<div class="bounceball">
							<div class="text" id="loading-t">Loading chart</div>
						</div>
					</div>
				</div>
				<canvas id="chart${station.number}"></canvas>
			</div>

			<div class='infowindow-text'>
            	<div class='circle-title'>${circle.title}: &nbsp;&nbsp;&nbsp;${station.status}</div>
            		<div class='bike'>
                		<div class='spaces'>Spaces: ${station.spaces}</div>
						<div class='line'></div>
                		<div class='bikes'>Bikes: ${station.bikes}</div>
						<br/>
						<div class='updateTime'>Last Update Time: ${date}</div>
                		<a class='link' href="/dash?stand=${station.number}">View on Dash</a>
            		</div>
				</div>
        	</div>
		</div>`
    );
    infowindow.open(map);
	let today = new Date();
	let day = today.getDay();
	loadChart(station.number, day, false, station.number);
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

	let directionsDisplay = new google.maps.DirectionsRenderer;
	let directionsService = new google.maps.DirectionsService;
	directionsDisplay.setMap(map);

    // First, clear out any existing markerArray
    // from previous calculations.


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

  //attribute somebody for this!
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

	// // When user click a tag, fillout the tag on the blank
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
	//
    // this.fliterStands = function(data, event){
    //     allCircles.map(circle => {
    //         let lowerCase = circle.title.toLowerCase();
    //         if (lowerCase.includes(data.keyword().toLowerCase())) {
    //             circle.setMap(map);
    //         } else {
    //             circle.setMap(null);
    //         }
    //     })
    // }



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
    if(document.getElementById("predictiveCheckBox").checked == true){
      predictive_directions = true;
    }
    else{
      predictive_directions = false
    }
    if (foundUserLocation == false || useAddress == true){
		if (!searchBox.getPlaces()) {
			sweetNote('Please input your location!');
      return false;
		} else {
			let temp =  searchBox.getPlaces()["0"].geometry.location;

			userLocation = {lat: temp.lat(),lng: temp.lng()};}}

			$('#loading-text').text('Try to find the nearest bike for you...');
			$('.overlay').show();
			let getBike = $.ajax({
				url: './distance',
				type: 'GET',
				data: {'origin': userLocation.lat.toString()+','+userLocation.lng.toString(), 'predictive':predictive_directions}
			});
			getBike.done(function(data) {
				$('.overlay').hide();
				data = JSON.parse(data);
				data['lng'] = data['long'];
				calcRoute(userLocation, data);
			})
			getBike.fail(function(data){
				$('.overlay').hide();
				sweetNote('Sorry, the server cannot find a bike for you!')
			});
		}




	this.findStation = function(data, event) {
    if(document.getElementById("predictiveCheckBox").checked == true){
      console.log('using predictive directions')
      predictive_directions = true;
    }
    else{
      predictive_directions = false
    }
    if (foundUserLocation==false || useAddress==true){
		if (!searchBox.getPlaces()) {
			sweetNote('Please input your location!');
      return false;
		} else {
			let temp =  searchBox.getPlaces()["0"].geometry.location;
			userLocation = {lat: temp.lat(),lng: temp.lng()};}}
			$('#loading-text').text('Try to find the nearest availabe station for you...');
			$('.overlay').show();
			let getStation = $.ajax({
				url: './distance',
				type: 'GET',
				data: {origin:userLocation.lat.toString()+','+userLocation.lng.toString(), 'mode':'bicycling', 'predictive':predictive_directions}
			})

			getStation.done(function(data){
				$('.overlay').hide();
				data = JSON.parse(data);
				data['lng'] = data['long'];
				calcRoute(userLocation, data);
			})

			getStation.fail(function(data){
				$('.overlay').hide();
				sweetNote('Sorry, the server cannot find a station for you!')
			});
	}
}
