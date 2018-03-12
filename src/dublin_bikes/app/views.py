from flask import render_template
from app import app
import time
from flask import request
from dublin_bikes.db import query as query
from dublin_bikes.analytics import single_stand as graph
from dublin_bikes.analytics import distances as distance
import json



@app.route('/graphview')
def graphView():

    graphView = open('app/static/html/graph-view.html').read()
    graphJs = open('app/static/js/graphView.js').read()
    return '<script>' + graphJs + '</script>' + graphView

@app.route('/dash')
def dashboard():
    return '<script>'+open('app/static/js/charts.js').read()+'</script>'+open('app/static/html/dashboard.html').read()




@app.route('/')
def index():
    '''loads index page'''

    mapjs = open('app/static/js/map.js', 'r').read()
    maphtml = open('app/static/html/index.html', 'r').read()
    graphtml = open('app/static/html/graph-canvas.html', 'r').read()
    graphjs = open('app/static/js/graph-canvas.js', 'r').read()

    #concantenate the js and html files and serve them
    return '<script>'+ mapjs + '</script>' + maphtml + '<script>'+graphjs+'</script>' + graphtml

@app.route('/circles')
def circles():
    '''loads *circles* version page'''

    mapjs = open('app/static/js/simplemapscriptWithCircles.js', 'r').read()
    maphtml = open('app/static/html/index.html', 'r').read()
    graphtml = open('app/static/html/graph-canvas.html', 'r').read()
    graphjs = open('app/static/js/graph-canvas.js', 'r').read()

    #concantenate the js and html files and serve them
    return '<script>'+ mapjs + '</script>' + maphtml + '<script>'+graphjs+'</script>' + graphtml



@app.route('/distance')
def findClosestStand():

    '''will return the closest stand to the stated origin
    this will unfortunately take almost a minute
    '''
    if request.args.get('origin')==None:
        origin = {'lat':53.3053, 'long': 6.2207}

    else:
        origin = request.args.get('origin').split(',')
        origin = {'lat': float(origin[0]), 'long': float(origin[1])}

    if request.args.get('mode')==None:
        mode = 'walking'
    #add other options here

    response = distance.getClosestStand(origin, mode)
    return json.dumps(response)


@app.route('/graph')
def getGtaphData():
    stand = request.args.get('stand')
    day = str(request.args.get('day'))
    return json.dumps(graph.prepareDayOfTheWeekData(stand, day))



#for requesting

@app.route('/request')
def getCurrentData():


    ''' should be able to use /request?type=currentstands
    to get a json object describing current stand occupancy
    (number of bikes, number of spaces)

    should be able to use /request?type=staticlocations
    to get a json object describing the locations
    (address, name, latitude, longitude etc)


    should be able to use /request?type=standnumber&stand=52&begin=123718&end=11471847
    to find data for a bike stand from a begin time to an end time

    begin and end default to only times within the last five minutes'''

    request_type = request.args.get('type')

    if request_type == 'currentstands':

        obj = query.queryCurrentStands()
        print (obj)
        return json.dumps(obj)

    elif request_type == 'staticlocations':

        obj = query.queryStaticLocations()
        print(obj)
        return json.dumps(obj)

    elif request_type == 'standnumber':

        if request.args.get('begin')!=None:

            begin = str(request.args.get('begin'))
            end= str(request.args.get('end'))
            stand = str(request.args.get('stand'))
            obj = query.queryStandNumber(stand, t1=begin, t2=end)






        else:
            obj = query.queryStandNumber(str(request.args.get('stand')))
            print(obj)
            return json.dumps(obj)

    elif request_type == 'liveData':
        obj1 = query.queryCurrentStands()
        obj2 = query.queryStaticLocations()
        for thing in obj1:

            obj2[thing]['bikes']=obj1[thing]['bikes']
            obj2[thing]['spaces']=obj1[thing]['spaces']


        return json.dumps(obj2)
