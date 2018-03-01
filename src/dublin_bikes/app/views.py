from flask import render_template
from app import app
from systeminfo import specs
from flask import request
from dublin_bikes.db import simple_query as query


@app.route('/')
def index():

    html = f.open('static/html/index.html', 'r').read()

    return html

@app.route('/request')
def getCurrentData():

    ''' should be able to use /request?type=currentstands
    to get a json object describing current stand occupancy
    (number of bikes, number of spaces)

    should be able to use /request?type=staticlocations
    to get a json object describing the locations
    (address, name, latitude, longitude etc)'''

    request_type = request.args.get('type')

    if request_type == 'currentstands':

        return query.dictionaryToJson(query.queryCurrentStands)

    elif request_type == 'staticlocations':

        return query.dictionaryToJson(query.queryStaticLocations())










    return simple_query.queryCurrentStands()

    #we're assuming this is a request to get all datapoints
