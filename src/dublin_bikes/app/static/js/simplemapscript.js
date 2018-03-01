var map;

  function initMap() {


//this entire script is a patchwork of stack over flow copy pasta //


    var uluru = {lat:  53.349, lng:-6.2603};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: uluru
    });
    var xmlhttp = new XMLHttpRequest();
  var url = "myTutorials.txt";

  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myArr = JSON.parse(this.responseText);
          readNext(myArr);

      }
  };
  xmlhttp.open("GET", 'http://0.0.0.0:5000/request?type=staticlocations', true);
  xmlhttp.send();

  }


  function readNext(myArr){
    var xmlhttp = new XMLHttpRequest();
  var url = "myTutorials.txt";
staticlocations = myArr;
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        console.log(myArr);
        addMarkers(staticlocations, myArr);

    }
};
xmlhttp.open("GET", 'http://0.0.0.0:5000/request?type=currentstands', true);
xmlhttp.send();



  }








  function addMarkers(staticlocations, currentData) {
    console.log(staticlocations)
    for (var i in staticlocations){

console.log(staticlocations)

console.log(staticlocations[i.toString()])
             lat = staticlocations[i.toString()].lat;
             long = staticlocations[i.toString()].long;

             if (currentData[i.toString()].bikes > currentData[i.toString()].spaces){

            e = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'

             }

             else{

               e = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'




             }


             var contentString='<div><p>'+staticlocations[i.toString()].address.toString()+'</p><p>Current bikes: '+currentData[i.toString()].bikes.toString()+'</p>'
             +'<p>Current stands: '+currentData[i.toString()].spaces.toString() +'</p></div>';



      marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(lat), parseFloat(long)),
        map: map,
        icon: e,
        title: staticlocations[i.toString()].name
    });

    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){
      return function() {
          infowindow.setContent(contentString);
          infowindow.open(map,marker);
      };
  })(marker,contentString,infowindow));


           }
      }
