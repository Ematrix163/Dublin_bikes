from dublin_bikes.db import query as query
import datetime
import time


def prepareData(stand, begin, end):
    '''return 100 data points representative of a stand's occupancy
    over a given time period

    Works for drawing simplistic graph (mainly to demonstrate the graph fucntion)

    Can be deleted soon'''

    #this gets graph data for a specified period
    #the period is set by two unix timestamps,
    #it can't. as of yet, handle date times.

    data = query.queryStandNumber(stand, t1=begin, t2=end)

    #there could be a ridiculous amount of data points, and ideally we want
    #to cut them down to something reasonable

    #this tries to cut the data into 100 bins, from which we take just one point.
    #we then return these points as a dictionary that can hopefully be graphed in javascript



    max_points = 100
    arr=[]
    if len(data)>max_points:

        #we want to get
        gap = int((end-begin)/max_points)

        current = begin
        for index in data:
            prev_index=index
            break
        for index in data:

            if int(index)>current+gap:

                arr.append([prev_index, data[prev_index]])
                arr.append([index, data[index]])


                current += gap + gap

            elif int(index)>current:

                arr.append([index, data[index]])
                current += gap

            prev_index = index

    else:
        gap = int((end-begin)/len(data))

        current = begin

        for index in data:

            if int(index)>current+gap:

                arr.append([prev_index, data[prev_index]])
                arr.append([index, data[index]])


                current += gap + gap

            elif int(index)>current:

                arr.append([index, data[index]])
                current += gap

            prev_index = index




    print(arr)
    print(len(arr))
    return arr


def prepareDayOfTheWeekData(stand, dayOfWeek):
    '''crude method for getting the average stand occupancy,

    for every five minute interval in a given day

    returns json like object that can easily be graphed

    however, statistically speaking, this might just be junk'''
    import time
    data = query.queryStandNumber(stand, 0, time.time())

    #as default, requests all data. I think a further method for finding everyday at once,

    #this method is a test, to be thrown away once we have a function for getting all the days data

    obj = makeEmptyJsonDayObject()
    for t in data:

        dtime = datetime.datetime.fromtimestamp(t)
        if dtime.weekday()==dayOfWeek:
            #if day of week is the same

            hour = dtime.hour
            minute = dtime.minute - (dtime.minute%5)
            #place this data in the nearest five minute intereval

            obj[hour*100+minute]['bikes'].append(data[t]['bikes'])
            obj[hour*100+minute]['spaces'].append(data[t]['spaces'])


    for t in obj:

        #loop through the arrays, and reduce them to their average value

        if len(obj[t]['bikes'])==0:
            obj[t]['bikes']==obj[t-5]['bikes']

        else:
            obj[t]['bikes']=sum(obj[t]['bikes'])/len(obj[t]['bikes'])

        if len(obj[t]['spaces'])==0:
            obj[t]['spaces']==obj[t-5]['spaces']
        else:
            obj[t]['spaces']=sum(obj[t]['spaces'])/len(obj[t]['spaces'])



    return obj



def makeEmptyJsonDayObject():

    '''return an empty json object of form
    \{time: { bikes: array, spaces: array} .... time {bikes..... \}}'''
    import time
    json = {}
    for i in range(0, 24):

        for z in range(0, 60, 5):

            json[100*i+z]={'bikes':[], 'spaces':[]}
    return json





if __name__ == '__main__':
    # test to see if this is working

    #print(prepareDayOfTheWeekData(), 6)
    #expet to see a json list grouped by g minute intervals with averages
    #e.g {'00':averageTime, '06':averageTime, '12':averageTime

    print(prepareDayOfTheWeekData(18, 5))

    print('\n\n\n\n\n')


    ##print(prepareData(68, 0, time.time()))





    #works fine, returning object of length 100, for files that have enough data
    #don't know yet wha happens if this isn't true
