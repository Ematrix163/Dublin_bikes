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
  center: dublin
});

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









}
