// the script depends on their being real time live data

// as such, it'll only work if the webscraper is running!

// this is even worse code spaghetti that the previous script




var map;

function initMap() {

///blanked out code is for getting user location, which just plain dosn't work!

  t=getLocation();
  if (t==0){
   var origin = new google.maps.LatLng(53.3053, -6.2207);
  }
  else{




    var origin = new google.maps.LatLng(parseFloat(t['lat']), parseFloat(t['long']))
  }
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();


//this entire script is a patchwork of stack over flow copy pasta //


    var dublin = {lat:  53.349, lng:-6.2603};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: origin
    });
    directionsDisplay.setMap(map);

    var xmlhttp = new XMLHttpRequest();


//get static data
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            readNext(myArr);

        }
    };
  //request data from database
  xmlhttp.open("GET", 'http://localhost:5000/request?type=staticlocations', true);
  xmlhttp.send();
  routify(origin, directionsService, directionsDisplay);

  }


  function readNext(myArr){
    //rget the next load of data - 'currentData'
    var xmlhttp = new XMLHttpRequest();

      staticlocations = myArr;
      xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              var currentData = JSON.parse(this.responseText);
              console.log(myArr);

              // add markers to the map using all of this data
              addMarkers(staticlocations, currentData);

    }


};
//request data from database
    xmlhttp.open("GET", 'http://localhost:5000/request?type=currentstands', true);
    xmlhttp.send();
}








function addMarkers(staticlocations, currentData) {

    for (var i in staticlocations){

      //loop through our staticLocations
             lat = parseFloat(staticlocations[i.toString()].lat)
             long = parseFloat(staticlocations[i.toString()].long)

             if (currentData[i.toString()].bikes > currentData[i.toString()].spaces){
               var bks = currentData[i.toString()].bikes;


              //determine the color of the circle to be drawn.
              //add more eloquent function
            if (bks > 30){
            var color = '#FF0000'
          }
          else{
          if (bks > 20){

            var color = '#DC143C'
          }
          else{



            var color = '#FFA07A'

          }
        }

            //use some kind of formula to determine how large the marker should be
            var scale = currentData[i.toString()].bikes - currentData[i.toString()].spaces + 1

             }

             else{

               var spcs = currentData[i.toString()].bikes;
               //assign a blue marker if there are more free stands than bikes
               if (spcs>30){
               var color = '#FF0000'
             }
             else{
               if (spcs>20){
                 var color = '#FF0000'
               }
               else{
                 var color = '#FF0000'

               }

             }

                //determine size of marker
               var scale = currentData[i.toString()].spaces- currentData[i.toString()].bikes + 1



             }

             //this is the content the user will see when they click a dot

             //it includes the function to display our graph, and the canvas element on which the graph is rendered
             var contentString='<div id="nooo"><p>'+staticlocations[i.toString()].address.toString()+'</p>'
            contentString+='<p>Current bikes: '+currentData[i.toString()].bikes.toString()+'</p>'+'<p>Current stands: '+currentData[i.toString()].spaces.toString() + '</p><p><button type="button" onclick="showGraph('+i.toString()+')">analytics</button></p>';
             contentString += '<canvas id="myCanvas'+i.toString()+'"  width="1000px"; height="200px" style="cursor:pointer; width:100%;"></canvas><br></div>';
             console.log(i.toString())






      marker = new google.maps.Marker({
        //create the marker
        position: new google.maps.LatLng(parseFloat(lat), parseFloat(long)),
        map: map,
        icon: {path: google.maps.SymbolPath.CIRCLE,
            scale: 0},
        title: staticlocations[i.toString()].name
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
            radius: scale*2
          });


    var infowindow = new google.maps.InfoWindow();

    //create the window that the user will see when they click the marker
    google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){
      return function() {

        //create an event listener to open the infowindow when the user clicks on the marker
          infowindow.setContent(contentString);
          infowindow.open(map,marker);


      };  //some closure that I don't understand. I think it's to stop all of the markers getting assigned the same info window
  })(marker,contentString,infowindow));


           }
      }


function routify(origin, directionsService, directionsDisplay){

  //tries to find and display a route from the user to the nearest bike stand
  //not functioning properly
  // see project issues
  console.log('routifying')
  var xmlhttp = new XMLHttpRequest();


//get static data
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        var lat = myArr.coords.lat;
        var long = myArr.coords.long;
        var destination = new google.maps.LatLng(lat, long);
        calcRoute(origin, destination, directionsService, directionsDisplay)
    }
};
//request data from database
xmlhttp.open("GET", 'http://localhost:5000/distance', true);
xmlhttp.send();




}


      function calcRoute(origin, destination, directionsService, directionsDisplay) {
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



/// getting current location, from w3 schools with edits

/// can only be fullfilled in a secure context? over https:?

///doesn't work!
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
          return {'lat': position.coords.latitude, 'long' : position.coords.longitude};
      }

      function returnError(error) {
        console.log('getting an error')
        console.log(error.code)
          switch(error.code) {
              case error.PERMISSION_DENIED:
              console.log('denied')
                  return 0;
                  break;
              case error.POSITION_UNAVAILABLE:
              console.log('unavaliable')
                  return 0;
                  break;
              case error.TIMEOUT:
                  return 0;
                  break;
              case error.UNKNOWN_ERROR:
                  return 0;
                  break;
          }
      }
      </script>

      </body>
      </html>
