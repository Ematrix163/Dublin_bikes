'use strict';

let allStations = [];
let allMarkers = [];
let map;
let largeInfowindow;


//The function is to get the user's location
function getLocation() {
    
    let userLocation = {};
    
    function goSuccess(position) {
        userLocation['lat'] = position.coords.latitude;
        userLocation['lng'] = position.coords.longitude;
        initMap(userLocation);
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(goSuccess);
    } else {
        userLocation = {lat: 53.3498, lng: -6.2306};
        initMap(userLocation);
    }
}

function initMap(userLocation) {
    
    let style = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "32"
            },
            {
                "lightness": "-3"
            },
            {
                "visibility": "on"
            },
            {
                "weight": "1.18"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "-70"
            },
            {
                "lightness": "14"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "100"
            },
            {
                "lightness": "-14"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "lightness": "12"
            }
        ]
    }
];
    largeInfowindow = new google.maps.InfoWindow();
    

    
    map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15,
        styles:style
    });

    //Use ajax request to get static data
    let getBikeStation = $.ajax({
        url: '../stations.json',
        method: 'GET',
    })
    
    //mark the user location
    let user = new google.maps.Circle({
        strokeColor: '#ff0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#0059ff',
        fillOpacity: 0.35,
        map: map,
        center: userLocation,
        radius: 100 
    });

    //If the ajax request success
    getBikeStation.done(function (data) {
        data.map(station => {
        	//Display the marker on the map
        	createMarkerInfoWindow(station, largeInfowindow);
           
        	//push current station to all station
        	allStations.push(station);
        })
        fitMap();
        
        let markerCluster = new MarkerClusterer(map, allMarkers,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    });

    //If the ajax request fail
    getBikeStation.fail(function (error) {
        //alert
        sweetNote('Static Data!');
    });

    //Make circles fit the map
    function fitMap() {
        let bounds = new google.maps.LatLngBounds();

        for (let eachMark of allMarkers) {
            eachMark.setMap(map);
            bounds.extend(eachMark.position);
        }
        map.fitBounds(bounds);
    }
}


function createMarkerInfoWindow(place, infowindow) {

    let location = {lat: place.latitude, lng: place.longitude};
    /*new marker object*/
    let marker = new google.maps.Marker({
        map: map,
        title: place.name,
        animation: google.maps.Animation.DROP,
        position: location,
        id: place.number
    });
    
    allMarkers.push(marker);
    
    //点击marker的时候，弹出街景显示
    marker.addListener('click', function () {
        populateInfoWindow(this, largeInfowindow)
    });


//    //滑动鼠标marker时候显示的效果
//    marker.addListener('mouseover', function () {
//        this.setIcon(highlightedIcon);
//    });
//
//    //鼠标移出marker显示的效果
//    marker.addListener('mouseout', function () {
//        this.setIcon(defaultIcon);
//    });
}

//The function is to alert error
function sweetNote(source) {
    swal({
        type: 'error',
        title: 'Oops',
        text: `Sorry, cannot get ${source}!`
    })
}

//弹出infowindow
function populateInfoWindow(marker, infowindow) {
   
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
        infowindow.open(map, marker);
    }
}

