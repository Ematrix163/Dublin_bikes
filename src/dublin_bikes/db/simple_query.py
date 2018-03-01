import datetime
import mysql.connector
import time
import json

def queryStandNumber(x, t1 = 0, t2 = time.time()+300, key='id'):
    '''gets all historical information about a specific stands occupancy'''

    #takes a key, and a value for the key
    #returns all the rows who match that key

    #basically ripped from
    #https://dev.mysql.com/doc/connector-python/en/connector-python-example-cursor-select.html

    passw=input('please enter password for the db: ')
    cnx = mysql.connector.connect(user='BikesMasterUser',\
    database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
    port = 3306, password = passw )
    cursor = cnx.cursor()

#this can be changed to reflect any query we like

    query = ("SELECT time, bikes, bikestands FROM testtest "
             "WHERE " +key+" = " + str(x) +" AND time > " +str(t1)+" AND time < " +str(t2))



    cursor.execute(query)

#should change to return data in json like format

    json={}
    for (arr) in cursor:
        json[arr[0]] ={'bikes': arr[1], 'spaces' : arr[2]}




    cursor.close()
    cnx.close()
    print(json)
    return json

def queryCurrentStands():
    '''seems to return most recent stands'''


    # this function isn't working!


        #takes a key, and a value for the key
        #returns all the rows who match that key

        #basically ripped from
        #https://dev.mysql.com/doc/connector-python/en/connector-python-example-cursor-select.html

    passw=input('please enter password for the db: ')
    t = time.time()
    t1 = int(t+250)
    t2 = int(t - 250)
    print(t1, t2)
    cnx = mysql.connector.connect(user='BikesMasterUser',\
    database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
    port = 3306, password = passw )
    cursor = cnx.cursor()

    #this can be changed to reflect any query we like

    query = ("SELECT id, bikes, bikestands  FROM testtest "
    "WHERE time < " +str(t1) + " AND time > " + str(t2))





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

        '''returns static stand data.
        Use this with queryCurrentStands() to set markers on map'''


        # this function isn't working!


            #takes a key, and a value for the key
            #returns all the rows who match that key

            #basically ripped from
            #https://dev.mysql.com/doc/connector-python/en/connector-python-example-cursor-select.html

        passw=input('please enter password for the db: ')

        cnx = mysql.connector.connect(user='BikesMasterUser',\
        database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
        port = 3306, password = passw )
        cursor = cnx.cursor()

        #this can be changed to reflect any query we like

        query = ("SELECT standid, name, address, lat, longitude  FROM bikestands ")

        cursor.execute(query)

        #should change to return data in json like format

        json={}
        for (arr) in cursor:
            print(arr)
            json[arr[0]]={'name' : arr[1], 'address' : arr[2], \
            'lat': arr[3], 'long':arr[4]}



        cursor.close()
        cnx.close()
        print(json)
        return json

def dictionaryToJson(dictionary):
    #do we want to pass dictionary as a string, a 'json' object, or just a dictionary?
    json = json.dumps(dictionary)
    return json


if __name__=='__main__':
    #testing
    queryStaticLocations()
    queryCurrentStands()
    queryStandNumber(5)
    queryCurrentStands()
