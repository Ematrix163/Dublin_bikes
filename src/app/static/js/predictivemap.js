let map;
let userLocation = {lat: 53.3083,lng: -6.2236};
let largeInfowindow;
let allCircles = []
let allStations = []



function showPredictiveMap() {
	$('#map').show();
	$('#average').hide();
	$('#predict').hide();
	$('#streetView').hide();
	$('#predictiveDays').hide();
	$('#currentData').hide();
	$('#averageDays').hide();
	$('#inputDate').show();
	$('.view').hide();

	map = new google.maps.Map(document.getElementById('map'), {
		center: userLocation,
		zoom: 15,
	});

	$('.stand-list-container').hide();
	let content =
	`<select class="form-control search-box" id='date'>
		  		<option value='0'>Day 1</option>
		  		<option value='1'>Day 2</option>
		  		<option value='2'>Day 3</option>
		  		<option value='3'>Day 4</option>
		  		<option value='4'>Day 5</option>
			</select>
			<select class="form-control search-box" id='time'>
				<option value='0'>00:00</option>
				<option value='1'>01:00</option>
				<option value='2'>02:00</option>
				<option value='3'>03:00</option>
				<option value='4'>04:00</option>
				<option value='5'>05:00</option>
				<option value='6'>06:00</option>
				<option value='7'>07:00</option>
				<option value='8'>08:00</option>
				<option value='9'>09:00</option>
				<option value='10'>10:00</option>
				<option value='11'>11:00</option>
				<option value='12'>12:00</option>
				<option value='13'>13:00</option>
				<option value='14'>14:00</option>
				<option value='15'>15:00</option>
				<option value='16'>16:00</option>
				<option value='17'>17:00</option>
				<option value='18'>18:00</option>
				<option value='19'>19:00</option>
				<option value='20'>20:00</option>
				<option value='21'>21:00</option>
				<option value='22'>22:00</option>
				<option value='23'>23:00</option>
			</select>
		<button type="button" id='showSearchButton' class="btn btn-primary btn-block" onClick="show()">Show</button>`;
	$('#inputDate').html(content);
}




//The function is to alert error
function sweetNote(source) {
    swal({
        type: 'error',
        title: 'Oops',
        text: source
    })
}



function setMapOnAll (m) {
	for (let circle of allCircles) {
		circle.setMap(m);
	}
}

function show() {


	setMapOnAll(null);
	allStations = []
	allCircles = []
	let time = $('#time').val();
	let date = $('#date').val();
	let myDate = Math.round((new Date()).getTime() / 1000);
	let predictTime = myDate + parseInt(time) * 3600 + parseInt(date) * 86400;
	let getPredict = $.ajax({
		url: '/request',
		type: 'GET',
		data: {'type':'predictall', 'time':predictTime}
	});


	getPredict.done(function(response){


		largeInfowindow = new google.maps.InfoWindow();
		let data = JSON.parse(response);
		for (let i in data) {

			data[i]['number'] = i;
			//Display the marker on the map
			createMarkerInfoWindow(data[i], largeInfowindow);
			//push current station to all station
			allStations.push(data[i]);
			fitMap();
		}
	})


	getPredict.fail(function(){
		sweetNote('Sorry, cannot display a prediction for this time. This may or may not be because of a server error.')
	})
}

function fitMap() {
	let bounds = new google.maps.LatLngBounds();
	allCircles.map(circle => {
		circle.setMap(map);
		bounds.union(circle.getBounds())
	})
	map.fitBounds(bounds);
}

function createMarkerInfoWindow(station, infowindow) {

    let location = {lat: station.lat,lng: station.long};

    if (station.bikes > station.stands + 5){
      var color = 'red';
    }
    else if (station.bikes + 5 < station.stands){
      var color = 'blue';
    }
    else {
      var color = ' #00FF00';
    }
    // create a new circle
    let stationCircle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        map: map,
        center: location,
        radius: 15* Math.sqrt(Math.max(Math.abs(station.bikes - station.stands), 10)),
        clickable: true,
        title: station.name
    })

    allCircles.push(stationCircle);

    google.maps.event.addListener(stationCircle, 'click', function (ev) {
        populateInfoWindow(this, largeInfowindow, ev, station);
    });
}





function populateInfoWindow(circle, infowindow, ev, station) {
    /*This function is to populate infowindow when the user clicks on a marker*/
    infowindow.setPosition(ev.latLng);

	let date = new Date(station.time);
	let hour = date.getHours();
	let min = date.getMinutes()
	console.log(hour);
	date = hour + ':' + min;


	let bikes = Math.floor(station.bikes);
	let spaces = Math.floor(station.stands);

    infowindow.setContent(
        `<div class='infowindow'>
			<div class='infowindow-text'>
            	<div class='circle-title'>${circle.title}</div>
            		<div class='bike'>
                		<div class='spaces'>Spaces: ${spaces}</div>
						<div class='line'></div>
                		<div class='bikes'>Bikes: ${bikes}</div>
            		</div>
				</div>
        	</div>
		</div>`);
    infowindow.open(map);
}
