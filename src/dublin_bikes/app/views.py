from flask import render_template
from app import app
import time
from flask import request
from dublin_bikes.db import query as query
from dublin_bikes.analytics import single_stand as graph
import json




@app.route('/')
def index():

    mapjs = open('app/static/js/simplemapscript.js', 'r').read()
    maphtml = open('app/static/html/index.html', 'r').read()
    graphtml = open('app/static/html/graph-canvas.html', 'r').read()
    graphjs = open('app/static/js/graph-canvas.js', 'r').read()

    #concantenate the js and html files and serve them
    return '<script>'+ mapjs + '</script>' + maphtml + '<script>'+graphjs+'</script>' + graphtml

@app.route('/circles')
def circles():

    mapjs = open('app/static/js/simplemapscriptWithCircles.js', 'r').read()
    maphtml = open('app/static/html/index.html', 'r').read()
    graphtml = open('app/static/html/graph-canvas.html', 'r').read()
    graphjs = open('app/static/js/graph-canvas.js', 'r').read()

    #concantenate the js and html files and serve them
    return '<script>'+ mapjs + '</script>' + maphtml + '<script>'+graphjs+'</script>' + graphtml



@app.route('/graph')
def getGtaphData():
    if request.args.get('begin')==None:
        begin = 0
    else:

        begin = request.args.get('begin')

    if request.args.get('end')==None:
        end = time.time()

    else:

        end = request.args.get('end')

    stand = request.args.get('stand')


    return json.dumps(graph.prepareData(stand, begin, end))



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
