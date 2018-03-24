//'use strict';
let allStations = [];
let allMarkers = [];
let allCircles = [];
let map;
let largeInfowindow;
let userLocation = {lat: 53.345228, lng: -6.272145};
let directionsDisplay;
let directionsService;


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        sweetNote('your location!')
        initMap();
    }
}


function showPosition(position) {
    userLocation.lat = position.coords.latitude;
    userLocation.lng =  position.coords.longitude;
    initMap();
}


function start() {
    getLocation();
}


function initMap() {
    
    /*This function is to initialising the map*/
  
    
    largeInfowindow = new google.maps.InfoWindow();
    
    //route service
    directionsService = new google.maps.DirectionsService();

    // create new map object
    map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15,
    });

    //Use ajax request to get static data
    let getBikeStation = $.ajax({
        url: './stations.json',
        dataType : 'json',
        method: 'GET'
    })

    //If the ajax request success
    getBikeStation.done(function (data) {
        data.map(station => {
        	//Display the marker on the map
        	createMarkerInfoWindow(station, largeInfowindow);
           
        	//push current station to all station
        	allStations.push(station);
        })
        fitMap();
    });

    //If the ajax request fail
    getBikeStation.fail(function (error) {
        //alert
        sweetNote('Static Data!');
    });

    // //Make markers fit the map
    // function fitMap() {
    //     let bounds = new google.maps.LatLngBounds();

    //     for (let eachMark of allMarkers) {
    //         eachMark.setMap(map);
    //         bounds.extend(eachMark.position);
    //     }
    //     map.fitBounds(bounds);
    // }
    

    // This function is to make circles fit the map
    function fitMap() {
        let bounds = new google.maps.LatLngBounds();
        allCircles.map(circle => {
            circle.setMap(map);
            bounds.union(circle.getBounds())
        })
        map.fitBounds(bounds);
    }
    
    directionsDisplay = new google.maps.DirectionsRenderer();
    
    directionsDisplay.setMap(map);
    
    // markthe user location
    var Marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: userLocation,
        icon: 'images/bluedot.png'
    });
}






function createMarkerInfoWindow(station, infowindow) {

    let location = {lat: station.position.lat, lng: station.position.lng};
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
    google.maps.event.addListener(stationCircle, 'click', function(ev){
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
    );
    
    
    infowindow.open(map);
    showDeatil();
}



//The function is to alert error
function sweetNote(source) {
    swal({
        type: 'error',
        title: 'Oops',
        text: `Sorry, cannot get ${source}!`
    })
}





function showDeatil() {
    let width = $('#detail').css
    $('#detail').css({'top':'-300px'});
    draw();
}





function draw() {
    Highcharts.chart('chart', {

        title: {
            text: 'Bike usage of this station'
        },

//        subtitle: {
//            text: 'Source: thesolarfoundation.com'
//        },

        yAxis: {
            title: {
                text: 'Number'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },

        series: [{
            name: 'Installation',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
            name: 'Manufacturing',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
            name: 'Sales & Distribution',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
            name: 'Project Development',
            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
            name: 'Other',
            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
}



function calcRoute() {

  // First, clear out any existing markerArray
  // from previous calculations.
  for (i = 0; i < allMarkers.length; i++) {
    allMarkers[i].setMap(null);
  }

  // Retrieve the start and end locations and create
  // a DirectionsRequest using WALKING directions.
  var start = new google.maps.LatLng(53.353462, -6.265305);
  var end = new google.maps.LatLng(53.344304,  -6.250427);

  var request = {
      origin: start,
      destination: end,
      travelMode: 'WALKING'
  };

  // Route the directions and pass the response to a
  // function to create markers for each step.
  directionsService.route(request, function(response, status) {
    if (status == "OK") {
        directionsDisplay.setDirections(response);
    }
  });
}
