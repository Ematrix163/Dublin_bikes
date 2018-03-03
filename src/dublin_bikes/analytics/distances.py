import requests
import json
from dublin_bikes.db import query


def getDistanceDuration(origin, destination, transportMode='walking'):

    lat1 = str(origin['lat'])
    long1 = str(origin['long'])
    lat2 = str(destination['lat'])
    long2 = str(destination['long'])


    requestString = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='
    requestString+=lat1+','+long1
    requestString+='&destinations='+lat2+','+long2
    requestString+='&mode='+transportMode+'&key=AIzaSyBSrSbeZwb9AeX2X8gh_AVErGaXVfpkriU'

    response = requests.get(requestString)
    response = json.loads(response.text)
    return response




def getClosestStand(origin, transportMode='walking'):
    closetDuration = 1000000
    lat1 = origin['lat']
    long1 = origin['long']
    staticlocations = query.queryStaticLocations()
    for index in staticlocations:

        lat2 = staticlocations[index]['lat']
        long2 = staticlocations[index]['long']
        destination = {'lat':lat2, 'long':long2}

        response = getDistanceDuration(origin, destination, transportMode)
        duration = response['rows'][0]['elements'][0]['duration']['value']
        if duration < closetDuration:

            closetDuration = duration
            closestStand = {'coords':destination,\
             'duration': response['rows'][0]['elements'][0]['duration']['text']\
             , 'address': response['destination_addresses'][0]}


    print(closestStand)
    return closestStand
if __name__=='__main__':

    a={"lat": 53.349562, "long": -6.278198}
    b={"lat":53.339983, "long": -6.295594}

    print(getDistanceDuration(a, b))
    #test for rathmines
    rathmines = {'lat': 53.3219, 'long':-6.2655}
    getClosestStand(rathmines)

    #test for clontarf
    clontarf =  {'lat':53.3660, 'long': -6.2045}
    getClosestStand(clontarf)
    ucd = {'lat':53.3053, 'long':-6.2207}
    getClosestStand(ucd)


    #test for ucd
