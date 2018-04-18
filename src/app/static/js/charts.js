let allLocation = {};
let predictive_data = {};
let previous = null;
let chosenStand;



$('#predictiveDays').hide();

$('.title').click(function() {
    $('.title').removeClass('active');
    $(this).toggleClass('active');
});
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

function makeTimeDictionary() {
    d = {}
    for (var i = 0; i < 24; i++) {

        if (i < 10) {
            var s = '0' + i.toString() + ':00'
        } else {
            s = i.toString() + ':00'
        }

        d[i] = s

    }
    return d
}
var timeDictionary = makeTimeDictionary()

function dateTimeLabels(array) {
    var arr = []
    for (object in array) {
        var d = new Date(object.time * 1000)
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
        data: {
            'type': 'liveData'
        }
    }).done(function(response) {
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

	$('.stand:first').css({'background-color': 'rgb(173,216,210)', 'color': 'white'});

    $('.stand').click(function() {
        $(this).css({'background-color': 'rgb(173,216,210)', 'color': 'white'});

        if (previous && $(previous).attr('data-id') != $(this).attr('data-id')) {
            $(previous).css({'background-color': '', 'color': 'black'});
        }
        previous = this;
        drawCurrent(this.getAttribute('data-id').toString());
        showAverage();
        drawAverage(this.getAttribute('data-id').toString(), currentDay);
		if ( $(this).attr('data-id') != '1') {
			$('.stand:first').css({'background-color': '', 'color': 'black'});
		}


    })
    chosenStand = 1;
    $('#predict').hide();
    drawCurrent(chosenStand);
    drawAverage(1, currentDay);
}

function drawCurrent(stand) {
    let bikes = allLocation[stand].bikes;
    let spaces = allLocation[stand].spaces;
    let status = allLocation[stand].status;
    $('#bikes').text('Current availabe bikes: ' + bikes);
    $('#stands').text('Current availabe spaces:' + spaces);
    $('#status').text('Current status:' + status);
}

function switchPredDay(day) {
    makePredictiveChart(day)
}

function switchDay(day) {
    keys = {
        '0': 'Mondays',
        '1': 'Tuesdays',
        '2': 'Wednesdays',
        '3': 'Thursdays',
        '4': 'Fridays',
        '5': 'Saturdays',
        '6': 'Sundays'
    }
    $('.overlay').show();
    $.ajax({
        url: '/graph',
        type: 'GET',
        data: {
            'stand': chosenStand,
            'day': day
        }
    }).done(function(response) {
        var data = JSON.parse(response);
        //Hide the overlay
        $('.overlay').hide();
        new Chart(document.getElementById('average-chart'), {
            type: 'line',
            data: {
                labels: makeTimeLabels(),
                datasets: [
                    {
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
                    text: 'Average stand occupancy by hour for ' + keys[day.toString()]
                }
            }
        });
    })
}

function drawAverage(stand, day) {
    keys = {
        '0': 'Mondays',
        '1': 'Tuesdays',
        '2': 'Wednesdays',
        '3': 'Thursdays',
        '4': 'Fridays',
        '5': 'Saturdays',
        '6': 'Sundays'
    }
    chosenStand = stand;
    $('.overlay').show();
    $.ajax({
        url: '/graph',
        type: 'GET',
        data: {
            'stand': stand,
            'day': day
        }
    }).done(function(response) {
        var data = JSON.parse(response);
        //Hide the overlay
        $('.overlay').hide();
        new Chart(document.getElementById('average-chart'), {
            type: 'line',
            data: {
                labels: makeTimeLabels(),
                datasets: [
                    {
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
                    text: 'Average stand occupancy by hour for ' + keys[day.toString()]
                }
            }
        });
    })
}

function loadChart(stand, day, buttons = true, targetId = false, predictive = false) {
    if (targetId == false) {
        $('.overlay').show();
    } else {
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
        data: {
            'stand': stand,
            'day': day
        }
    }).done(function(response) {
        var data = JSON.parse(response);
        makeChart(data, day, targetId);
    })
}

function makeChart(data, day, targetId = false) {
    keys = {
        '0': 'Monday',
        '1': 'Tuesday',
        '2': 'Wednesday',
        '3': 'Thursday',
        '4': 'Friday',
        '5': 'Saturday',
        '6': 'Sunday'
    }
    //this part is largely
    //internet chart.js copypasta
    chart_id = "chart"
    if (targetId != false) {
        chart_id = "chart" + targetId.toString()
    }

    console.log(data.bikes)
    console.log(data.spaces)
    console.log('making chart')

    var labels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

    if (targetId == false) {
        $('.overlay').hide();
    } else {
        $('.chartoverlay').hide();
    }

    new Chart(document.getElementById(chart_id), {
        type: 'line',
        data: {
            labels: makeTimeLabels(),
            datasets: [
                {
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
	$('#inputDate').hide();
    $('#average').show();
    $('#predict').hide();
    $('#streetView').hide();
    $('#predictiveDays').hide();
	$('#map').hide();
	$('.stand-list-container').show();
    $('#currentData').show();
    $('#averageDays').show();
	$('.stand:first').css({'background-color': 'rgb(173,216,210)', 'color': 'white'});
	$('.view').show();
}

function showForecast() {
	$('#inputDate').hide();
    $('#average').hide();
    $('#predict').show();
	$('#map').hide();
    $('#averageDays').hide()
    $('#predictiveDays').show()
    $('#streetView').hide();
    $('#currentData').show();
	$('.stand-list-container').show();
	$('.view').show();
    getPredicts(currentStand);

	if (previous) {
		$(previous).css({'background-color': '', 'color': 'black'});
	}
	$('.stand:first').css({'background-color': 'rgb(173,216,210)', 'color': 'white'});
}

function showStreetView() {
	$('#inputDate').hide();
	$('#map').hide();
    $('#average').hide();
    $('#predict').hide();
    $('#streetView').show();
    $('#currentData').hide();
    $('#predictiveDays').hide();
    $('#averageDays').hide();
	$('.stand-list-container').show();
	$('.view').hide();
    displayStreetView();
	if (previous) {
		$(previous).css({'background-color': '', 'color': 'black'});
	}
	$('.stand:first').css({'background-color': 'rgb(173,216,210)', 'color': 'white'});
}

function displayStreetView() {
    let loc = {
        'lat': allLocation[chosenStand].lat,
        'lng': allLocation[chosenStand].long
    };
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

function getPredicts(stand) {
    let begin = Math.round((new Date()).getTime() / 1000);
    let end = begin + 4320000;
    $('.overlay').show();
    $.ajax({
        url: '/request',
        type: 'GET',
        data: {
            'type': 'predictrange',
            'stand': stand,
            'begin': begin,
            'end': end
        }
    }).done(function(response) {
        predictive_data = JSON.parse(response);
        console.log('Get predicted data successfully!');
        $('.overlay').hide();

        makePredictiveChart(0);
    });

}

function makePredictiveChart(day) {
    length = predictive_data['times'].length
    begin = parseInt(length * (day / 5))
    end = parseInt(length * (day + 1) / 5)
    console.log(begin, end)
    console.log(predictive_data)
    bikes = predictive_data['bikes'].slice(begin, end)
    console.log(bikes)
    spaces = predictive_data['spaces'].slice(begin, end)
    times = predictive_data['times'].slice(begin, end)
    var beginDate = new Date(times[0] * 1000);
    var endDate = new Date(times[times.length - 1] * 1000)
    var description = 'Predicted stand occupancy from ' + beginDate.toString() + ' to ' + endDate.toString()
    for (var i = 0; i < times.length; i++) {

        var t = new Date(times[i] * 1000)
        times[i] = t.getHours()
    }
    labs = []
    for (var i = 0; i < times.length; i++) {
        labs.push(timeDictionary[times[i]])
    }
    console.log(labs)
    new Chart(document.getElementById('predict-chart'), {
        type: 'line',
        data: {
            labels: labs,
            datasets: [
                {
                    data: bikes,
                    label: "Bikes",
                    borderColor: "red",
                    fill: true
                }, {
                    data: spaces,
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
                text: description
            }
        }
    })
}

//copied from stack overflow
function scrollIntoView(eleID) {
    var e = document.getElementById(eleID);
    if (!!e && e.scrollIntoView) {
        e.scrollIntoView();
    }
}
