
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
import datetime
import copy

# This is our load routine, basically

global_stands = []
global_bike_data = []
global_static = []
global_last_update = 0
global_weather = []
global_cached_graphs = {}
global_merged = {}
global_time = datetime.datetime.fromtimestamp(timemodule.time())
global_bike_data = []

#methods for caching and updating certain data
def cachegraphdata(get_all_data=False):
    '''This functions is meant to be threaded. It will download information about daily stand occupancy and cache it, in order to speed up request times.'''

    print('begin caching graph data....')
    global global_static
    global global_cached_graphs
    global global_time
    create_graph_cache = False
    if get_all_data:
        global global_bike_data
        global_bike_data= graph.getGraphData()

    while True:

        actual_day = int(global_time.weekday())

        for number in global_static:
            time.sleep(2)
            #update the actual_day graphs first, as these are what the user sees on the index page
            try:
                global_cached_graphs[int(number)][actual_day]=graph.prepareDayOfTheWeekData(int(number), actual_day, data=global_bike_data)
            except:
                print('Failed to update graph for stand', number, 'day', actual_day)



        for day in [d for d in range (7) if d != actual_day]:

            for number in global_static:
                time.sleep(2)
                try:
                    global_cached_graphs[int(number)][day]=graph.prepareDayOfTheWeekData(int(number), day, data=global_bike_data)

                except:

                    print('Failed to update graph for stand', number, 'day', day)

        #sleep for a whole day once this is done
        timemodule.sleep(86400)




def updateLiveData():
    '''This function is meant to be threaded. It will update the current weather and stand occupancy data every five minutes.'''

    global global_stands
    global global_static
    global global_last_update
    global global_cached_graps
    global global_weather
    global global_time
    global global_merged
    launched_graph_cache=True
    create_graph_cache=False
    print('launched updater')
    while True:

        try:

            global_static = query.queryStaticLocations()

        except:

            print('Failed to update static locations')

        print('Querying current stand occupancy')

        try:

            global_stands = query.queryCurrentStands()

        except:

            print('Failed to update current stands')

        print('Grabbing static locations')

        print('Grabbing current weather data')

        try:

            global_weather=query.queryWeather()

        except:

            print('Failed to update weather')



        global_last_update=timemodule.time()
        global_time = datetime.datetime.fromtimestamp(timemodule.time())
        merged={}
        print('merging stands and current data')
        for each in global_static:

            merged[each] = dict(global_stands[each], **global_static[each])

        #make absolutely sure we aren't just referring to a dictionary reference.

        global_merged = copy.deepcopy(merged)
        if not create_graph_cache:
            create_graph_cache = True
            for number in global_static:

                global_cached_graphs[int(number)]={}

        if launched_graph_cache == False:


            print('launching graph cacher')
            #launch the graph cacher
            launched_graph_cache=True
            graphcacher = Thread(target=cachegraphdata, args=[True])
            graphcacher.start()

        #sleep for five minutes
        timemodule.sleep(300)

print('Gathering live data...')
updater = Thread(target=updateLiveData)
updater.start()

#block until static locations have been retrieved
while global_static == []:
    pass

predictiveModel = predictor.predictor(global_static)
print('Ready to begin accepting request..')






# These are the actual routing functions for the app



@app.route('/')
def index():

    '''Loads index page'''

    print(keyring.getWeatherKey())
    return render_template("index.html", key = keyring.getMapKey(), a = keyring.getWeatherKey() )




@app.route('/dash')
def dashboard():

    '''Returns the dash.html page, with the given stand number preloaded'''

    if request.args.get('stand')==None:

        stand = 1

    #need to change these into a returnable template
    else:
        stand = str(request.args.get('stand'))


    return render_template('dashboard.html', value = stand)




@app.route('/distance')
def findClosestStand():
    global predictiveModel

    '''Will return the closest stand (with at least five bikes or five spaces) to the stated origin. Transport mode is used as a proxy for whether the user is seeking a bike or location. 'Cycling' will return a stand with spaces, 'walking' will return a stand with bikes.

    If 'predictive' is used as a parameter, it will attempt to use our model to find the best stand for the user, given the time it will take for them to walk there. The results are middling to say the least.

    '''
    if request.args.get('origin')==None:
        #default origin
        origin = {'lat':53.3053, 'long': -6.2207}

    else:
        origin = request.args.get('origin').split(',')
        origin = {'lat': float(origin[0]), 'long': float(origin[1])}

    if request.args.get('mode')==None:

        mode = 'walking'

    if request.args.get('mode')=='bicycling':

        mode = 'bicycling'

    #add other options here
    if request.args.get('predictive')==None or request.args.get('predictive')==False:

        response = distance.getClosestStand(origin, mode)

    else:
        response=predictiveModel.getClosestStand(origin, mode)


    return json.dumps(response)


@app.route('/graph')
def getGraphData():

    '''Returns a set of data points representing the average occupancy of a stand on a given day'''

    global global_cached_graphs
    stand = int(request.args.get('stand'))
    day = int(str(request.args.get('day')))

    if day in global_cached_graphs[stand]:
        #first check to see if we've cached the graph data
        return json.dumps(global_cached_graphs[stand][day])

    else:
        #if it's not there, grab it instead, add it to the cache, and then return it
        data = graph.prepareDayOfTheWeekData(stand, day)
        global_cached_graphs[stand][day]=data
        return json.dumps(data)



#for requesting
@app.route('/request')
def getCurrentData():

    '''Multiple request methods packed into this one link. Sorted by type.'''

    global global_stands
    global global_static
    global global_last_update
    global predictiveModel
    global global_weather
    global global_merged


    request_type = request.args.get('type')

    if request_type == 'currentstands':

        obj = global_stands

        return json.dumps(obj)

    elif request_type == 'staticlocations':

        obj = global_static

        return json.dumps(obj)

    elif request_type == 'standnumber':

        if request.args.get('begin')!=None:

            begin = str(request.args.get('begin'))
            end= str(request.args.get('end'))
            stand = str(request.args.get('stand'))
            obj = query.queryStandNumber(stand, t1=begin, t2=end)

        else:
            obj = query.queryStandNumber(str(request.args.get('stand')))

        return json.dumps(obj)

    elif request_type == 'liveData':

        return json.dumps(global_merged)

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

    elif request_type == 'predictall':

        time = request.args.get('time')
        return json.dumps(predictor.predictMass(global_merged, time))
