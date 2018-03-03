import datetime
import mysql.connector
import time
import json as js

global passw
passw = input('please enter a password: ')


def insertLiveDB(data, timestamp):

    #make this a db method
    #this is the same function as in upload_static.py
    #i just copied it word for word off mysql.com
    #let's replace it with something better
    global passw

    cnx = mysql.connector.connect(user='BikesMasterUser',\
    database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
    port = 3306, password = passw )
    cursor = cnx.cursor()

    for thing in data:


        #upload each entry
        add_stand = ("INSERT INTO testtest "
                     "(id, time, bonus, banking, status, bikestands, bikes) "
                       "VALUES (%s,%s,%s,%s,%s,%s,%s)" )


        data_stand=(int(thing['number']), timestamp, str(thing['bonus'])[0],str(thing['banking'])[0], str(thing['status']),int(thing['available_bike_stands']), int(thing['available_bikes']))


        # Insert new employee
        cursor.execute(add_stand, data_stand)


    # Make sure data is committed to the database

    cnx.commit()

    cursor.close()
    cnx.close()
