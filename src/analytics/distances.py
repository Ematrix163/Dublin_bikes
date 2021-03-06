"""Includes methods for getting distances from stands to an origin point, and returning the closest stand to the origin with a satisfactory number of bikes"""


import requests
import json
from db import query
from math import inf
from db import keyring


def getAllDistancesInOneApiCall(origin, staticlocations, transportMode='walking'):

    '''Uses the google distance matrix api to get the distances for all static locations from a given origin'''

    requestString = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='
    requestString+=str(origin['lat'])+','+str(origin['long'])
    requestString+='&destinations='

    for coords in staticlocations:

        lat2 = str(coords['lat'])
        long2 = str(coords['long'])
        requestString+=lat2 + ',' + long2 +'|'

    requestString=requestString[:-1]


    requestString+='&mode='+transportMode+'&key='+keyring.getDistanceKey()

    response = requests.get(requestString)


    return json.loads(response.text)


def getClosestStand(origin, merged, transportMode='walking'):

    '''iterates through all stands and finds the closest one to the origin'''


    closestDuration = inf
    lat1 = origin['lat']
    long1 = origin['long']

    coords = []
    for stand_number in merged:

        if transportMode=='walking':

            if merged[stand_number]['bikes']>5:

                coords.append({'lat':merged[stand_number]['lat'], 'long':merged[stand_number]['long']})

        else:

            if merged[stand_number]['spaces']>5:

                coords.append({'lat':merged[stand_number]['lat'], 'long':merged[stand_number]['long']})

    data = getAllDistancesInOneApiCall({'lat':lat1, 'long':long1}, coords, transportMode)

    closest_index = 0

    for index, location in enumerate(data['rows'][0]['elements']):

        if location['duration']['value']<closestDuration:
            closest_index = index
            closestDuration = location['duration']['value']



    return coords[closest_index]
