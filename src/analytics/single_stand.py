from db import query as query
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
    stand = int(stand)
    dayOfWeek = int(dayOfWeek)
    import time
    data = query.queryStandNumber(stand)


    #as default, requests all data. I think a further method for finding everyday at once,

    #this method is a test, to be thrown away once we have a function for getting all the days data

    json = makeEmptyJsonDayObject()

    for t in data:
        time_c = int(t)/1000
        dtime = datetime.datetime.fromtimestamp(time_c)
        hour = dtime.hour

        print(dtime.weekday())
        if dtime.weekday()==dayOfWeek:
            #if day of week is the same




            #place this data in the nearest five minute intereval

            json[hour]['bikes'].append(int(data[t]['bikes']))
            json[hour]['spaces'].append(int(data[t]['spaces']))

    print(json)
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





if __name__ == '__main__':
    # test to see if this is working

    #print(prepareDayOfTheWeekData(), 6)
    #expet to see a json list grouped by g minute intervals with averages
    #e.g {'00':averageTime, '06':averageTime, '12':averageTime

    print(prepareDayOfTheWeekData(78, 5))

    print('\n\n\n\n\n')


    ##print(prepareData(68, 0, time.time()))





    #works fine, returning object of length 100, for files that have enough data
    #don't know yet wha happens if this isn't true
