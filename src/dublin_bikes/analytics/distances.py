import requests
import json
from dublin_bikes.db import query
from math import inf


def getDistanceDuration(origin, destination, transportMode='walking'):
    '''uses google api to find the time from origin to destination'''

    lat1 = str(origin['lat'])
    long1 = str(origin['long'])



    requestString = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='
    requestString+=lat1+','+long1
    requestString+='&destinations='+lat2+','+long2
    requestString+='&mode='+transportMode+'&key=AIzaSyBSrSbeZwb9AeX2X8gh_AVErGaXVfpkriU'

    response = requests.get(requestString)
    response = json.loads(response.text)
    return response


def getAllDistancesInOneApiCall(origin, staticlocations, transportMode='walking'):

    requestString = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='
    requestString+=str(origin['lat'])+','+str(origin['long'])
    requestString+='&destinations='
    for location in staticlocations:

        lat2 = str(staticlocations[location]['lat'])
        long2 = str(staticlocations[location]['long'])
        requestString+=lat2 + ',' + long2 +'|'

    requestString=requestString[:-1]


    requestString+='&mode='+transportMode+'&key=AIzaSyBSrSbeZwb9AeX2X8gh_AVErGaXVfpkriU'

    response = requests.get(requestString)
    response = json.loads(response.text)

    return response









def getClosestStand(origin, transportMode='walking'):

    '''iterates through all stands and finds the closest one to the origin'''
    closestDuration = inf
    lat1 = origin['lat']
    long1 = origin['long']
    staticlocations = query.queryStaticLocations()
    coords = []
    for location in staticlocations:
        coords.append({'lat':staticlocations[location]['lat'], 'long':staticlocations[location]['long']})
    data = getAllDistancesInOneApiCall({'lat':lat1, 'long':long1}, staticlocations)
    closest_index = 0
    for index, location in enumerate(data['rows'][0]['elements']):

        if location['duration']['value']<closestDuration:
            closest_index = index
            closestDuration = location['duration']['value']



    return coords[closest_index]
