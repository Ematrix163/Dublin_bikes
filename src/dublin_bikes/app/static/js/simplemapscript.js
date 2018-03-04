// the script depends on their being real time live data

// as such, it'll only work if the webscraper is running!


//I think this is what they call 'spaghetti code!




var map;

  function initMap() {


//this entire script is a patchwork of stack over flow copy pasta //


    var dublin = {lat:  53.349, lng:-6.2603};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: dublin
    });
    var xmlhttp = new XMLHttpRequest();


//get static data
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myArr = JSON.parse(this.responseText);
          //go to next function when data is received
          readNext(myArr);

      }
  };
  //request data from database
  xmlhttp.open("GET", 'http://0.0.0.0:5000/request?type=staticlocations', true);
  xmlhttp.send();

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
      xmlhttp.open("GET", 'http://0.0.0.0:5000/request?type=currentstands', true);
      xmlhttp.send();



  }







function addMarkers(staticlocations, currentData) {

    for (var i in staticlocations){

      //loop through our staticLocations


             lat = staticlocations[i.toString()].lat;
             long = staticlocations[i.toString()].long;

             if (currentData[i.toString()].bikes > currentData[i.toString()].spaces){

               //assign a red marker if there are more bikes than free stands

            e = 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Red_Dot_X_-_Single_Red_Dot.png'


            //use some kind of formula to determine how large the marker should be
            var scale = currentData[i.toString()].bikes - currentData[i.toString()].spaces + 1

             }

             else{

               //assign a blue marker if there are more free stands than bikes

               e = 'https://upload.wikimedia.org/wikipedia/commons/6/69/Dot_X_-_Single_Blue_Dot.png'

                //determine size of marker
               var scale = currentData[i.toString()].spaces- currentData[i.toString()].bikes + 1



             }

             //this is the content the user will see when they click a dot

             //it includes the function to display our graph, and the canvas element on which the graph is rendered
             var contentString='<div id="nooo"><p>'+staticlocations[i.toString()].address.toString()+'</p>'
            contentString+='<p>Current bikes: '+currentData[i.toString()].bikes.toString()+'</p>'+'<p>Current stands: '+currentData[i.toString()].spaces.toString() + '</p><p><button type="button" onclick="showGraph('+i.toString()+')">analytics</button></p>';
             contentString += '<canvas id="myCanvas'+i.toString()+'"  width="1000px"; height="200px" style="cursor:pointer; width:100%;"></canvas><br></div>';
             console.log(i.toString())


             var icon = {
               //this determines what the marker will look like.
               // to do : fix origin and anchor so that markers don't end up in the liffey/grand canal dock
                 url: e, // url
                 scaledSize: new google.maps.Size(5+scale*1.5, 5+scale*1.5), // scaled size
                 origin: new google.maps.Point(0,0), // origin
                 anchor: new google.maps.Point(0, 0) // anchor
             };



      marker = new google.maps.Marker({
        //create the marker
        position: new google.maps.LatLng(parseFloat(lat), parseFloat(long)),
        map: map,
        icon: icon,
        title: staticlocations[i.toString()].name
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
