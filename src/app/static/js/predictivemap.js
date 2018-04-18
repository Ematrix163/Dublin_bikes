let map;
let userLocation = {lat: 53.3083,lng: -6.2236};


function showPredictiveMap() {

	$('#average').hide();
	$('#predict').hide();
	$('#streetView').hide();
	$('#predictiveDays').hide();
	$('#currentData').hide();
	$('#averageDays').hide();

	map = new google.maps.Map(document.getElementById('map'), {
		center: userLocation,
		zoom: 15,
	});

	$('.stand-list-container').hide();



	let content =
	`<select class="form-control" id='date'>
		  		<option value='0'>Day 1</option>
		  		<option value='1'>Day 2</option>
		  		<option value='2'>Day 3</option>
		  		<option value='3'>Day 4</option>
		  		<option value='4'>Day 5</option>
			</select>
			<select class="form-control" id='time'>
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




function show() {
	let time = $('#time').val();
	let date = $('#date').val();
	console.log(time, date);

	let myDate = Math.round((new Date()).getTime() / 1000);
	let predictTime = myDate + parseInt(time) * 3600 + parseInt(date) * 86400;

	let getPredict = $.ajax({
		url: '/request',
		type: 'GET',
		data: {'type':'predictall', 'time':predictTime}
	});


	getPredict.done(function(response){
		
	})


}
