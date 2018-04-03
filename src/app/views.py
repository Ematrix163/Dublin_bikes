from flask import render_template
from app import app
import time
from flask import request
from db import query
from analytics import single_stand as graph
from analytics import distances as distance
import json



@app.route('/')
def index():
    '''loads index page'''
    return render_template("index.html")

@app.route('/charts.js')
def chartSrcipt():

    return open('app/static/js/charts.js', 'r').read()



@app.route('/dash')
def dashboard():
<<<<<<< HEAD

    #need to change these into a returnable template
    return open('app/static/html/dashboard.html').read()

=======
	return render_template('dashboard.html')
>>>>>>> 0afcb4264e79bdd6f7e52fdafacd406d2a41009b



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



#### to be deleted

@app.route('/static', methods=["GET"])
def getStatic():
    if request.method == 'GET':
        obj = query.queryStaticLocations()
        return json.dumps(obj)






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
        print(obj1)
        obj2 = query.queryStaticLocations()
        for thing in obj1:

            obj2[thing]['bikes']=obj1[thing]['bikes']
            obj2[thing]['spaces']=obj1[thing]['spaces']



        return json.dumps(obj2)
