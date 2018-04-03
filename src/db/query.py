import datetime
import mysql.connector
import time
import json as js
import getpass
global passw

passw = getpass.getpass('Enter db password:')

def queryStandNumber(x):
    '''gets all historical information about a specific stands occupancy


    by supplying time parameters, it can also get information within a timeframe'''

    #takes a key, and a value for the key
    #returns all the rows who match that key

    #basically ripped from
    #https://dev.mysql.com/doc/connector-python/en/connector-python-example-cursor-select.html


    cnx = mysql.connector.connect(user='BikesMasterUser',\
    database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
    port = 3306, password = passw )
    cursor = cnx.cursor()

#this can be changed to reflect any query we like

    query = ("SELECT time, available_bikes, available_bike_stands, bike_stands, status FROM dynamic_bikes WHERE number = "  + str(x))



    cursor.execute(query)

#should change to return data in json like format

    json={}
    for (arr) in cursor:
        json[arr[0]] ={'bikes': arr[1], 'spaces' : arr[2]}

    cursor.close()
    cnx.close()

    return json




def queryCurrentStands():
    global passw
    '''returns current stand occupancy data for all stands'''

    t = time.time()
    t1 = t+1000
    t2 = t - 1000
    print(t1, t2)
    cnx = mysql.connector.connect(user='BikesMasterUser',\
    database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
    port = 3306, password = passw )
    cursor = cnx.cursor()

    #this can be changed to reflect any query we like
    query = ("SELECT id, bikes, bikestands  FROM testtest "
    "WHERE time < " +str(t1)+" AND time > " +str(t2))


    cursor.execute(query)

    #should change to return data in json like format

    json={}
    for (arr) in cursor:
        print(arr)
        json[arr[0]]={'bikes' : arr[1], 'spaces' : arr[2]}



    cursor.close()
    cnx.close()
    print(json)
    return json


def queryStaticLocations():
    global passw

    ''' gets name, address and coordinates for all stands '''

    cnx = mysql.connector.connect(user='BikesMasterUser',\
    database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
    port = 3306, password = passw)
    cursor = cnx.cursor()

    #this can be changed to reflect any query we like

    query = ("SELECT standid, name, address, lat, longitude  FROM bikestands ")

    cursor.execute(query)

    #should change to return data in json like format

    # I've changed the type here because it is easy for me to loop the list in js
    json=[]
    for (arr) in cursor:
        json.append({'number':arr[0], 'name' : arr[1], 'address' : arr[2], 'lat': arr[3], 'long':arr[4]})

    cursor.close()
    cnx.close()

    return json





if __name__=='__main__':
    #test all methods
#
   print(queryStandNumber(5))
#    print(queryCurrentStands())
    # print(queryStaticLocations())
