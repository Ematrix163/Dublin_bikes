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
		data = JSON.parse(response);
		drawStandsButtons(data, currentStand, currentDay);
	});
}


function drawStandsButtons(data, currentStand, currentDay) {
	console.log(data);

	for (let stand in data) {
		allLocation[stand] = data[stand];
		$('#stand-list').append(`<li class='stand' data-id=${stand}>${data[stand].name}</li>`);
	}
	console.log(allLocation);
	$('.stand').click(function(){
		// Add listen click function
		loadChart(this.getAttribute('data-id'), currentDay);
	})
    loadChart(currentStand, currentDay);
}


function reloadChart(day) {

	$.ajax({
		url: '/graph',
		type: 'GET',
		data: {'stand': chosenStand, 'day':day}
	}).done(function(response){
		var data = JSON.parse(response);
		makeChart(data);
	})
}


function loadChart(stand, day, buttons = true, targetId = false) {
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

//copied from stack overflow
function scrollIntoView(eleID) {
   var e = document.getElementById(eleID);
   if (!!e && e.scrollIntoView) {
       e.scrollIntoView();
   }
}
