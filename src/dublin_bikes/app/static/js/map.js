var map;

//to do

//gather data (location, markers, shortest route)
//markers and current data should be reduced to one api call. In fact, maybe it could
//all be reduced to one api call?

//or... load map and then look for user location etc?

function initMap() {


  var dublin = {lat:  53.349, lng:-6.2603};



  map = new google.maps.Map(document.getElementById('map'), {
  zoom: 15,
  center: dublin });


var xmlhttp = new XMLHttpRequest();
//get all data for drawing map markers
  xmlhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {

          var data = JSON.parse(this.responseText);
        //go to next function when data is received
          processData(data);

    }
};
//request data from database
  xmlhttp.open("GET", 'http://localhost:5000/request?type=liveData', true);
  xmlhttp.send();

}

function processData(data){

  addMarkers(data)
  //aysnc call to start loading directions data
  getLocation();
}

function addMarkers(data) {

    for (var i in data){

      var lat = parseFloat(data[i].lat);
      var long = parseFloat(data[i].long);


//need like a continuous function to do this part elegantly
      if (data[i].bikes > data[i].spaces){

        var color = '#FF2222'
        var scale = 2 + 5 * (data[i].spaces / data[i].bikes)
      }
      else if (data[i].bikes < data[i].spaces + 5 || data[i].spaces < data[i].bikes + 5) {

        var color = '#2AFF22'
        var scale = 4;
      }
      else{

        var color = '#2265FF'
        var scale = 4 + 5 * (data[i].bikes / data[i].spaces)
      }


            //this is the html that will appear in marker windows
             var contentString='<div id="nooo"><p>'+data[i.toString()].address.toString()+'</p>'
            contentString+='<p>Current bikes: '+data[i.toString()].bikes.toString()+'</p>'+'<p>Current stands: '+data[i.toString()].spaces.toString() + '</p>';
             contentString += '<canvas id="chart"  width="1000px"; height="500px" style="cursor:pointer; width:100%;"></canvas><br></div>';







      marker = new google.maps.Marker({
        //create the marker
        position: new google.maps.LatLng(parseFloat(lat), parseFloat(long)),
        map: map,
        icon: {path: google.maps.SymbolPath.CIRCLE,
            scale: 2},
        title: data[i.toString()].name
    });


    var cityCircle = new google.maps.Circle({
      //google docs copy pasta
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,
            map: map,
            center: {lat: parseFloat(lat), lng: parseFloat(long)},
            radius: scale*10
          });


    var infowindow = new google.maps.InfoWindow();

    //create the window that the user will see when they click the marker
    google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){
      return function() {

        //create an event listener to open the infowindow when the user clicks on the marker
          infowindow.setContent(contentString);
          infowindow.open(map,marker);
          var d = new Date()
          var day = d.getDay()-1
          loadChart(parseInt(i),day, buttons=false);


      };  //some closure that I don't understand. I think it's to stop all of the markers getting assigned the same info window
  })(marker,contentString,infowindow));


           }
      }








function getLocation() {
  console.log('getting location')
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(returnPosition, returnError);
    } else {
        return 0;
    }
}

function returnPosition(position) {
  console.log('returning position')
    var origin = {'lat': position.coords.latitude, 'long' : position.coords.longitude};
    routify(origin);
}

function returnError(error) {
  console.log('getting an error')
  console.log(error.code)
    switch(error.code) {
      //default to UCD coordinates if there is an error
        case error.PERMISSION_DENIED:
        console.log('denied')
        var origin = {'lat':53.3083, 'long':-6.2236}
        routify(origin);
            return 0;
            break;
        case error.POSITION_UNAVAILABLE:
        console.log('unavaliable')
        var origin = {'lat':53.3083, 'long':-6.2236}
        routify(origin);
            return 0;
            break;
        case error.TIMEOUT:
        var origin = {'lat':53.3083, 'long':-6.2236}
        routify(origin);
            return 0;
            break;
        case error.UNKNOWN_ERROR:
        var origin = {'lat':53.3083, 'long':-6.2236}
        routify(origin);
            return 0;
            break;
    }
}

function routify(origin){
  console.log(origin.lat, origin.long)
  //tries to find and display a route from the user to the nearest bike stand
  //not functioning properly
  // see project issues
  console.log('routifying')
  var xmlhttp = new XMLHttpRequest();


//get static data
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        var lat = myArr.lat;
        var long = myArr.long;
        console.log(lat, long)
        var destination = new google.maps.LatLng(lat, long);
        origin = new google.maps.LatLng(parseFloat(origin.lat), parseFloat(origin.long))
        calcRoute(origin, destination)

    }
};
//request data from database
xmlhttp.open("GET", 'http://localhost:5000/distance?origin='+origin.lat.toString()+','+origin.long.toString(), true);
xmlhttp.send();




}


function calcRoute(origin, destination) {

  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  console.log('calculating route')
  //ripped from google documentation
  var selectedMode = 'WALKING';
  var request = {
      origin: origin,
      destination: destination,

      travelMode: google.maps.TravelMode[selectedMode]
  };
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(response);
    }
  });
}
