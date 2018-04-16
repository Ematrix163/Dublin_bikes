from db import query as query
import datetime
import time

def prepareDayOfTheWeekData(stand, dayOfWeek):
    '''Returns average occupancy of a given stand, for every hour of a specified week day'''
    print(stand)
    stand = int(stand)
    dayOfWeek = int(dayOfWeek)
    import time
    data = query.queryStandNumberFull(stand)


    #as default, requests all data. I think a further method for finding everyday at once,

    #this method is a test, to be thrown away once we have a function for getting all the days data

    json = makeEmptyJsonDayObject()

    for t in data:
        time_c = int(t)/1000
        dtime = datetime.datetime.fromtimestamp(time_c)
        hour = dtime.hour


        if dtime.weekday()==dayOfWeek:
            #if day of week is the same

            #place this data in the nearest five minute intereval

            json[hour]['bikes'].append(int(data[t]['bikes']))
            json[hour]['spaces'].append(int(data[t]['spaces']))


    response = {'spaces':[], 'bikes':[]}
    for t in json:

        #loop through the arrays, and reduce them to their average value


        if len(json[t]['bikes'])==0:
            response['bikes'].append(0)
            response['spaces'].append(0)
        else:
            response['bikes'].append(int(sum(json[t]['bikes'])/len(json[t]['bikes'])))


            response['spaces'].append(int(sum(json[t]['spaces'])/len(json[t]['spaces'])))




    return response



def makeEmptyJsonDayObject():

    '''return an empty json object of form
    \{time: { bikes: array, spaces: array} .... time {bikes..... \}}'''
    import time
    json = {}
    for i in range(0, 24):

        json[i] = {'bikes':[], 'spaces':[]}


    return json








    #works fine, returning object of length 100, for files that have enough data
    #don't know yet wha happens if this isn't true
