let allLocation = {};
let chosenStand;
//attempt at graphs using charts.js library
function makeTimeLabels() {
    arr = []
    for (var i = 0; i < 24; i++) {
        if (i < 10) {
            arr.push('0' + i.toString() + ':00')
        } else {
            arr.push(i.toString() + ':00')
        }
    }
    return arr
}



function dateTimeLabels(array){
  var arr = []
  for (object in array){
    var d = new Date(object.time*1000)
    arr.push(d.toString())
  }
  return arr
}


function getStaticLocations(currentStand, currentDay) {
    console.log('getting static data')
    //get all data for drawing map markers
	$.ajax({
		url: './request',
		type: 'GET',
		data: {'type':'staticlocations'}
	}).done(function(response){
		console.log('getting static data successfully!');
		data = JSON.parse(response);
		drawStandsButtons(data, currentStand, currentDay);
	});
}


function drawStandsButtons(data, currentStand, currentDay) {
	for (let stand in data) {
		allLocation[stand] = data[stand];
		$('#stand-list').append(`<li class='stand' data-id=${stand}>${data[stand].name}</li>`);
	}
	$('.stand').click(function(){
		showAverage();
		drawAverage(this.getAttribute('data-id').toString(),currentDay);
	})
	chosenStand = 1;
	drawAverage(1,currentDay);
}

function switchDay(day) {
	$('.overlay').show();
	$.ajax({
		url: '/graph',
		type: 'GET',
		data: {'stand': chosenStand, 'day':day}
	}).done(function(response){
		var data = JSON.parse(response);
		//Hide the overlay
		$('.overlay').hide();
		new Chart(document.getElementById('average-chart'), {
			type: 'line',
			data: {
				labels: makeTimeLabels(),
				datasets: [{
						data: data.bikes,
						label: "Bikes",
						borderColor: "red",
						fill: true
		  }, {
						data: data.spaces,
						label: 'Spaces',
						borderColor: "blue",
						fill: true
		  }
		]
			},
			options: {
				responsive: true,
				responsiveAnimationDuration: 30,
				maintainAspectRatio: false,
				title: {
					display: true,
					text: 'Average stand occupancy by hour'
				}
			}
		});
	})
}


function drawAverage(stand, day) {
	chosenStand = stand;
	$('.overlay').show();
	$.ajax({
		url: '/graph',
		type: 'GET',
		data: {'stand': stand, 'day':day}
	}).done(function(response){
		var data = JSON.parse(response);
		//Hide the overlay
		$('.overlay').hide();
		new Chart(document.getElementById('average-chart'), {
	        type: 'line',
	        data: {
	            labels: makeTimeLabels(),
	            datasets: [{
	                    data: data.bikes,
	                    label: "Bikes",
	                    borderColor: "red",
	                    fill: true
	      }, {
	                    data: data.spaces,
	                    label: 'Spaces',
	                    borderColor: "blue",
	                    fill: true
	      }
	    ]
	        },
	        options: {
				responsive: true,
				responsiveAnimationDuration: 30,
				maintainAspectRatio: false,
	            title: {
	                display: true,
	                text: 'Average stand occupancy by hour'
	            }
	        }
	    });
	})
}





function loadChart(stand, day, buttons = true, targetId = false, predictive=false) {
	if (targetId == false){
		$('.overlay').show();
	}
	else {
		$('.chartoverlay').show()
	}
  	console.log(stand, day)
    if (buttons === true) {
        currentDay = day;
        currentStand = stand;
    }
    console.log('getting chart information')

	$.ajax({
		url: '/graph',
		type: 'GET',
		data: {'stand': stand, 'day':day}
	}).done(function(response){
		var data = JSON.parse(response);
		makeChart(data, targetId);
	})
}


function makeChart(data, targetId=false) {
    //this part is largely
    //internet chart.js copypasta
    chart_id = "chart"
    if (targetId != false){
      chart_id = "chart"+targetId.toString()
    }

	if (chartType == 'average') {

	}
	else if (chartType = 'predict') {

	}

    console.log(data.bikes)
    console.log(data.spaces)
    console.log('making chart')

    var labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    if (targetId==false){
		$('.overlay').hide();
	}
	else{
	  $('.chartoverlay').hide();
	}

    new Chart(document.getElementById(chart_id), {
        type: 'line',
        data: {
            labels: makeTimeLabels(),
            datasets: [{
                    data: data.bikes,
                    label: "Bikes",
                    borderColor: "red",
                    fill: true
      }, {
                    data: data.spaces,
                    label: 'Spaces',
                    borderColor: "blue",
                    fill: true
      }
    ]
        },
        options: {
			responsive: true,
			responsiveAnimationDuration: 30,
			maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Average stand occupancy by hour'
            }
        }
    });

}


function showAverage() {
	$('#average').show();
	$('#predict').hide();
	$('#streetView').hide();
}

function showForecast() {
	$('#average').hide();
	$('#predict').show();
	$('#streetView').hide();
	drawForecast();
}



function showStreetView() {
	$('#average').hide();
	$('#predict').hide();
	$('#streetView').show();
	displayStreetView();
}


function displayStreetView() {
	let loc = {'lat': allLocation[chosenStand].lat, 'lng': allLocation[chosenStand].long};
	let streetViewService = new google.maps.StreetViewService();
	streetViewService.getPanoramaByLocation(loc, 50, getStreetView);

	function getStreetView(data, status) {
		if (status == google.maps.StreetViewStatus.OK) {
			console.log('Get StreetView successfully!');
			let nearStreetViewLocation = data.location.latLng;
			panoramaOptions = {
			   position: nearStreetViewLocation,
			   pov: {
				   heading: 35,
				   pitch: 30
			   }
			};
		}
		let panorama = new google.maps.StreetViewPanorama(document.getElementById('streetView'), panoramaOptions);
	}
}


function predict(stand){
	let begin = Math.round((new Date()).getTime() / 1000);
	let end = begin + 432000;

	$.ajax({
		url: '/request',
		type: 'GET',
		data: {'type':'predictrange', 'stand':stand, 'begin':begin, 'end':end}
	}).done(function(response){
		let data = JSON.parse(response);
		console.log('Get predicted data successfully!');
		let time = [];
		data.times.map(each => {
			let a = new Date(each*1000);
			let date = a.getDate()
			let hours = a.getHours();
			time.push(hours);
		});

		new Chart(document.getElementById('predict-chart'), {
			type: 'line',
			data: {
				labels: time,
				datasets: [{
						data: data.bikes,
						label: "Bikes",
						borderColor: "red",
						fill: true
		  }, {
						data: data.spaces,
						label: 'Spaces',
						borderColor: "blue",
						fill: true
		  }
		]
			},
			options: {
				responsive: true,
				responsiveAnimationDuration: 30,
				maintainAspectRatio: false,
				title: {
					display: true,
					text: 'Five day bike forecast'
				}
			}
		});
	})
}



//copied from stack overflow
function scrollIntoView(eleID) {
   var e = document.getElementById(eleID);
   if (!!e && e.scrollIntoView) {
       e.scrollIntoView();
   }
}
