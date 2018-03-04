function showMap(){

//switch for toggling map/graph view. Not currently implemented
  document.getElementById('myCanvas').style.display='none';
  document.getElementById('map').style.display='';
}



function showGraph(stand){

  //create and display the graph
  console.log('showingGraph for' + stand.toString())

  var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);

  //on retrieving data, make the graph
            document.getElementById('myCanvas'+stand.toString()).style.display='';


            makeCanvas(myArr, stand);

      }
  };
  //request data from database
  //getting data
  xmlhttp.open("GET", 'http://0.0.0.0:5000/graph?stand='+stand.toString(), true);
  xmlhttp.send();
}



function makeCanvas(data, stand){
  console.log(data)
  var color_bikes = 'red'
  var color_spaces = 'blue'

  var canvas = document.getElementById('myCanvas'+stand.toString());
    var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

//constants needed for drawing the graph
	var width = canvas.width;
	var height = canvas.height;
	var length = data.length;
	var interval = Math.floor(width/length);
  var max=0;


//find the max value for the y axis - super bad method
  for(var i = 0; i<data.length;i++){

      console.log(data[i])
      cell = data[i]
      if (cell[1].bikes>max){
      max = cell[1].bikes;
      }

      if(cell[1].spaces>max){
      max = cell[1].spaces;
      }
}


//set the size of the y axis
  var scale = Math.floor(max* 1.2);

  //draw the first point on the graph
  ctx.beginPath();
  ctx.moveTo(0, height - (height*(data[0][1].bikes/scale)))
  var i=0

  //draw all of the red points on the graph
  for (var i = 1; i<data.length; i++){
        var point = data[i]

        ctx.lineTo(i*interval, height-(height*(point[1].bikes/scale)));
        i+=1
}

//now that the path has been defined, actually draw the line
  ctx.lineWidth = 5;
  ctx.translate(0.5, 0.5);
  ctx.strokeStyle = 'red';
  ctx.stroke();


//do the same for all the yellow points
ctx.beginPath();
ctx.moveTo(0, height - (height*(data[0][1].spaces/scale)))
i=0
  for (var i = 1; i<data.length; i++){
          var point = data[i]
          ctx.lineTo(i*interval, height-(height*(point[1].spaces/scale)));
          i+=1
  }

  ctx.lineWidth = 5;
  ctx.translate(0.5, 0.5);
  ctx.strokeStyle = 'blue';
  ctx.stroke();
  ctx.closePath;

  //graph should now be drawn




	}
