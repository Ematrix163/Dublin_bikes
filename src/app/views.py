
from flask import render_template
from app import app
import time as timemodule
from flask import request
from db import query
from analytics import single_stand as graph
from analytics import distances as distance
import json
from analytics import predictor
from db import keyring
from threading import Thread

#set up our global variables
predictiveModel = predictor.predictor()
global_stands = []
global_static = []
global_last_update = 0
global_weather = []
global_cached_graphs = {}

def updateLiveData():
    global global_stands
    global global_static
    global global_last_update
    global global_cached_graps
    global global_weather
    launched_graph_cache=False
    while True:

        global_stands = query.queryCurrentStands()
        global_static = query.queryStaticLocations()
        global_weather=query.queryWeather()
        global_last_update=timemodule.time()
        if launched_graph_cache == False:
            for number in global_static:
                global_cached_graphs[int(number)]={}
            launched_graph_cache=True
            graphcacher = Thread(target=cachegraphdata)
            graphcacher.start()
        timemodule.sleep(300)

print('Gathering live data...')
updater = Thread(target=updateLiveData)
updater.start()

def cachegraphdata():
    print('begin caching....')
    global global_static
    global global_cached_graphs
    while True:

        for number in global_static:

            for day in range(7):

                global_cached_graphs[int(number)][day]=graph.prepareDayOfTheWeekData(int(number), day)


        timemodule.sleep(86400)









@app.route('/')
def index():
    '''loads index page'''
    return render_template("index.html", key = keyring.getMapKey())

@app.route('/charts.js')
def chartSrcipt():

    return open('app/static/js/charts.js', 'r').read()



@app.route('/dash')
def dashboard():

    if request.args.get('stand')==None:

        stand = 1
        print('erro')
    #need to change these into a returnable template
    else:
        stand = str(request.args.get('stand'))


    return render_template('dashboard.html', value = stand)




@app.route('/distance')
def findClosestStand():

    '''will return the closest stand to the stated origin
    this will unfortunately take almost a minute
    '''
    if request.args.get('origin')==None:
        origin = {'lat':53.3053, 'long': 6.2207}

    else:
        origin = request.args.get('origin').split(',')
        origin = {'lat': float(origin[0]), 'lng': float(origin[1])}

    if request.args.get('mode')==None:
        mode = 'walking'

    if request.args.get('mode')=='bicycling':

        mode = 'bicycling'
    #add other options here

    response = distance.getClosestStand(origin, mode)
    return json.dumps(response)


@app.route('/graph')
def getGraphData():

    global global_cached_graphs
    stand = request.args.get('stand')
    day = str(request.args.get('day'))
    print(global_cached_graphs[int(stand)])
    try:
        return json.dumps(global_cached_graphs[int(stand)][int(day)])
    except:

        KeyError
        print('not found in cache')
        data = graph.prepareDayOfTheWeekData(stand, day)
        global_cached_graphs[int(stand)][int(day)]=data
        return json.dumps(data)



#for requesting
@app.route('/request')
def getCurrentData():
    global global_stands
    global global_static
    global global_last_update
    global predictiveModel
    global global_weather
    ''' should be able to use /request?type=currentstands
    to get a json object describing current stand occupancy
    (number of bikes, number of spaces)

    should be able to use /request?type=staticlocations
    to get a json object describing the locations
    (address, name, latitude, longitude etc)

    should be able to use /request?type=standnumber&stand=52&begin=123718&end=11471847
    to find data for a bike stand from a begin time to an end time

    begin and end default to only times within the last five minutes

    '''
    '''
    I think here we should use 'POST' methond ranther than 'GET', because 'GET' API is not safety in network.
    Here we try to make it private not public. So I just change your code.

    2018-03-27  Chen
    '''

    request_type = request.args.get('type')



    print(request_type)

    if request_type == 'currentstands':


        obj = global_stands
        print (obj)
        return json.dumps(obj)

    elif request_type == 'staticlocations':



        obj = global_static
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




        merged = {}

        for each in global_static:
            merged[each] = dict(global_stands[each], **global_static[each])

        return json.dumps(merged)

    elif request_type == 'weather':
        w = query.queryWeather()

        return json.dumps(w)
    #add method for predictions. So far untested
    elif request_type == 'prediction':



        if request.args.get('stand') != None and request.args.get('time')!= None:

            stand = request.args.get('stand')
            time = request.args.get('time')
            prediction = predictiveModel.predict(int(stand), int(time))
            if prediction != None:
                print(prediction)
                return str(prediction)
            else:
                return 'Error etc'

        else:
            return 'Error. Missing parameters.'

    elif request_type == 'predictrange':


        stand = request.args.get('stand')
        begin = request.args.get('begin')
        end=request.args.get('end')

        if stand!=None and begin!=None and end!= None:

            return json.dumps(predictiveModel.predictRange(int(stand), int(begin), int(end)))

        else:
            return 'Error. Missing parameters.'
