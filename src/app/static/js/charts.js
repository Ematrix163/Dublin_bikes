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

function getStaticLocations() {
    console.log('getting static data')
    var xmlhttp = new XMLHttpRequest();
    //get all data for drawing map markers
    xmlhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            var data = JSON.parse(this.responseText);
            //go to next function when data is received
            console.log('received')
            drawStandsButtons(data);

        }
    };
    //request data from database
    xmlhttp.open("GET", '/request?type=staticlocations', true);
    xmlhttp.send();



}


function drawStandsButtons(data) {

    var html = '<ul>';
    for (var stand in data) {

        html += '<li style="cursor:pointer" id="button' + stand.toString() + '" onclick="loadChart(' + stand.toString() + ', currentDay)">' + data[stand].name + '</li>'
    }
    html += '</ul>'
    document.getElementById('standsList').innerHTML = html;
    loadChart(1, 1);
}

function loadChart(stand, day, buttons = true) {
    if (buttons === true) {
        document.getElementById('button' + currentStand.toString()).style.backgroundColor = 'white';
        document.getElementById('button' + stand.toString()).style.backgroundColor = 'deepskyblue';
        console.log(currentDay, day)
        document.getElementById('dayButton' + currentDay.toString()).style.backgroundColor = 'white';
        document.getElementById('dayButton' + day.toString()).style.backgroundColor = 'deepskyblue';
        currentDay = day;
        currentStand = stand;
    }
    console.log('getting chart information')
    var xmlhttp = new XMLHttpRequest();
    //get all data for drawing map markers
    xmlhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            var data = JSON.parse(this.responseText);
            //go to next function when data is received
            console.log('received')
            makeChart(data);

        }
    };
    //request data from database
    xmlhttp.open("GET", '/graph?stand=' + stand.toString() + '&day=' + day.toString(), true);
    xmlhttp.send();





}

function makeChart(data) {
    //this part is largely
    //internet chart.js copypasta
    console.log(data.bikes)
    console.log(data.spaces)
    console.log('making chart')
    var labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    new Chart(document.getElementById("chart"), {
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
            title: {
                display: true,
                text: 'Average stand occupancy by hour'
            }
        }
    });

}


function createDayBar() {
    document.getElementById('dayBar').innerHTML
    html = '<div class="col-md-5"></div>'

    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    for (var i = 0; i < 7; i++) {

        html += '<div class="col-md-1" id="dayButton' + i.toString() + '" style="cursor:pointer" onclick="loadChart(currentStand, ' + i.toString() + ')">' + days[i] + '</div>';


    }

    document.getElementById('dayBar').innerHTML = html


}
var currentStand = 1
var currentDay = 1