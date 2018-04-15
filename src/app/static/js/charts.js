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
    var xmlhttp = new XMLHttpRequest();
    //get all data for drawing map markers
    xmlhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            //go to next function when data is received
            console.log('received')
			console.log(data);
            drawStandsButtons(data, currentStand, currentDay);

        }
    };
    //request data from database
    xmlhttp.open("GET", '/request?type=staticlocations', true);
    xmlhttp.send();
}



function drawStandsButtons(data, currentStand, currentDay) {

    var html = '<ul>';
    for (var stand in data) {

        html += '<li style="cursor:pointer" id="button' + stand.toString() + '" onclick="loadChart(' + stand.toString() + ', currentDay)">' + data[stand].name + '</li>'
    }
    html += '</ul>'
    document.getElementById('standsList').innerHTML = html;
    document.getElementById("button"+currentStand.toString()).scrollIntoView();
    loadChart(currentStand, currentDay);
}





function loadChart(stand, day, buttons = true, targetId = false) {
  console.log(stand, day)
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
            makeChart(data, targetId);

        }
    };
    //request data from database

    xmlhttp.open("GET", '/graph?stand=' + stand.toString() + '&day=' + day.toString(), true);
    xmlhttp.send();

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
			maintainAspectRatio: false,
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

//copied from stack overflow
function scrollIntoView(eleID) {
   var e = document.getElementById(eleID);
   if (!!e && e.scrollIntoView) {
       e.scrollIntoView();
   }
}
