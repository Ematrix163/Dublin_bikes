'use strict';


let allStations = [];
let allMarkers = [];
let allCircles = [];
let map, user;
let largeInfowindow;
let userLocation = {lat: 53.345228,lng: -6.272145};
let searchBox;

let weatherIcons = {
  "200": {
    "label": "thunderstorm with light rain",
    "icon": "storm-showers"
  },

  "201": {
    "label": "thunderstorm with rain",
    "icon": "storm-showers"
  },

  "202": {
    "label": "thunderstorm with heavy rain",
    "icon": "storm-showers"
  },

  "210": {
    "label": "light thunderstorm",
    "icon": "storm-showers"
  },

  "211": {
    "label": "thunderstorm",
    "icon": "thunderstorm"
  },

  "212": {
    "label": "heavy thunderstorm",
    "icon": "thunderstorm"
  },

  "221": {
    "label": "ragged thunderstorm",
    "icon": "thunderstorm"
  },

  "230": {
    "label": "thunderstorm with light drizzle",
    "icon": "storm-showers"
  },

  "231": {
    "label": "thunderstorm with drizzle",
    "icon": "storm-showers"
  },

  "232": {
    "label": "thunderstorm with heavy drizzle",
    "icon": "storm-showers"
  },

  "300": {
    "label": "light intensity drizzle",
    "icon": "sprinkle"
  },

  "301": {
    "label": "drizzle",
    "icon": "sprinkle"
  },

  "302": {
    "label": "heavy intensity drizzle",
    "icon": "sprinkle"
  },

  "310": {
    "label": "light intensity drizzle rain",
    "icon": "sprinkle"
  },

  "311": {
    "label": "drizzle rain",
    "icon": "sprinkle"
  },

  "312": {
    "label": "heavy intensity drizzle rain",
    "icon": "sprinkle"
  },

  "313": {
    "label": "shower rain and drizzle",
    "icon": "sprinkle"
  },

  "314": {
    "label": "heavy shower rain and drizzle",
    "icon": "sprinkle"
  },

  "321": {
    "label": "shower drizzle",
    "icon": "sprinkle"
  },

  "500": {
    "label": "light rain",
    "icon": "rain"
  },

  "501": {
    "label": "moderate rain",
    "icon": "rain"
  },

  "502": {
    "label": "heavy intensity rain",
    "icon": "rain"
  },

  "503": {
    "label": "very heavy rain",
    "icon": "rain"
  },

  "504": {
    "label": "extreme rain",
    "icon": "rain"
  },

  "511": {
    "label": "freezing rain",
    "icon": "rain-mix"
  },

  "520": {
    "label": "light intensity shower rain",
    "icon": "showers"
  },

  "521": {
    "label": "shower rain",
    "icon": "showers"
  },

  "522": {
    "label": "heavy intensity shower rain",
    "icon": "showers"
  },

  "531": {
    "label": "ragged shower rain",
    "icon": "showers"
  },

  "600": {
    "label": "light snow",
    "icon": "snow"
  },

  "601": {
    "label": "snow",
    "icon": "snow"
  },

  "602": {
    "label": "heavy snow",
    "icon": "snow"
  },

  "611": {
    "label": "sleet",
    "icon": "sleet"
  },

  "612": {
    "label": "shower sleet",
    "icon": "sleet"
  },

  "615": {
    "label": "light rain and snow",
    "icon": "rain-mix"
  },

  "616": {
    "label": "rain and snow",
    "icon": "rain-mix"
  },

  "620": {
    "label": "light shower snow",
    "icon": "rain-mix"
  },

  "621": {
    "label": "shower snow",
    "icon": "rain-mix"
  },

  "622": {
    "label": "heavy shower snow",
    "icon": "rain-mix"
  },

  "701": {
    "label": "mist",
    "icon": "sprinkle"
  },

  "711": {
    "label": "smoke",
    "icon": "smoke"
  },

  "721": {
    "label": "haze",
    "icon": "day-haze"
  },

  "731": {
    "label": "sand, dust whirls",
    "icon": "cloudy-gusts"
  },

  "741": {
    "label": "fog",
    "icon": "fog"
  },

  "751": {
    "label": "sand",
    "icon": "cloudy-gusts"
  },

  "761": {
    "label": "dust",
    "icon": "dust"
  },

  "762": {
    "label": "volcanic ash",
    "icon": "smog"
  },

  "771": {
    "label": "squalls",
    "icon": "day-windy"
  },

  "781": {
    "label": "tornado",
    "icon": "tornado"
  },

  "800": {
    "label": "clear sky",
    "icon": "sunny"
  },

  "801": {
    "label": "few clouds",
    "icon": "cloudy"
  },

  "802": {
    "label": "scattered clouds",
    "icon": "cloudy"
  },

  "803": {
    "label": "broken clouds",
    "icon": "cloudy"
  },

  "804": {
    "label": "overcast clouds",
    "icon": "cloudy"
  },


  "900": {
    "label": "tornado",
    "icon": "tornado"
  },

  "901": {
    "label": "tropical storm",
    "icon": "hurricane"
  },

  "902": {
    "label": "hurricane",
    "icon": "hurricane"
  },

  "903": {
    "label": "cold",
    "icon": "snowflake-cold"
  },

  "904": {
    "label": "hot",
    "icon": "hot"
  },

  "905": {
    "label": "windy",
    "icon": "windy"
  },

  "906": {
    "label": "hail",
    "icon": "hail"
  },

  "951": {
    "label": "calm",
    "icon": "sunny"
  },

  "952": {
    "label": "light breeze",
    "icon": "cloudy-gusts"
  },

  "953": {
    "label": "gentle breeze",
    "icon": "cloudy-gusts"
  },

  "954": {
    "label": "moderate breeze",
    "icon": "cloudy-gusts"
  },

  "955": {
    "label": "fresh breeze",
    "icon": "cloudy-gusts"
  },

  "956": {
    "label": "strong breeze",
    "icon": "cloudy-gusts"
  },

  "957": {
    "label": "high wind, near gale",
    "icon": "cloudy-gusts"
  },

  "958": {
    "label": "gale",
    "icon": "cloudy-gusts"
  },

  "959": {
    "label": "severe gale",
    "icon": "cloudy-gusts"
  },

  "960": {
    "label": "storm",
    "icon": "thunderstorm"
  },

  "961": {
    "label": "violent storm",
    "icon": "thunderstorm"
  },

  "962": {
    "label": "hurricane",
    "icon": "cloudy-gusts"
  }
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
		url: 'http://api.openweathermap.org/data/2.5/weather?q=Dublin,Irl&APPID=def5ec12072a2e8060e27a30bdbebb2e'
	})

	getWeather.done(function(data){
    console.log(data)

		 let w  = data['main'];
		 $('#temp').text('Temp:' + w['temp']);
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

    /*This function is to populate infowindow when user click*/
    infowindow.setPosition(ev.latLng);

	var date = new Date(station.time);
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
		if (!searchBox.getPlaces()) {
			sweetNote('Please input your location!');
		} else {
			let temp =  searchBox.getPlaces()["0"].geometry.location;

			userLocation = {lat: temp.lat(),lng: temp.lng()};
			$('#loading-text').text('Try to find the nearest bike for you...');
			$('.overlay').show();
			let getBike = $.ajax({
				url: './distance',
				type: 'GET',
				data: {'origin': userLocation.lat.toString()+','+userLocation.lng.toString()}
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



	}


	this.findStation = function(data, event) {

		if (!searchBox.getPlaces()) {
			sweetNote('Please input your location!');
		} else {
			let temp =  searchBox.getPlaces()["0"].geometry.location;
			userLocation = {lat: temp.lat(),lng: temp.lng()};
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




}
