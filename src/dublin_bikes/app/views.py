from flask import render_template
from app import app

from flask import request
from dublin_bikes.db import simple_query as query

import json
@app.route('/')
def index():

    html = open('app/static/html/index.html', 'r').read()

    return html

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
