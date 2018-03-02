from dublin_bikes.db import simple_query as query
import datetime
import time


def prepareData(stand, begin, end):
    #this is returning nonsense
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


if __name__ == '__main__':
    # test to see if this is working

    print(prepareData(68, 0, time.time()))

    #works fine, returning object of length 100, for files that have enough data
    #don't know yet wha happens if this isn't true
