import datetime
import mysql.connector
import time
import json as js

import getpass
global passw
from db import query




def insertLiveDB(data, timestamp):

    '''inserts new stand data (from the bikes api) into the database. Used by webscraper.
    Largely composed of copypasta from mysql.com/stack overflow'''
    global passw

    cnx = query.makeCnx()
    cursor = cnx.cursor()

    for thing in data:


        #upload each entry
        add_stand = ("INSERT INTO testtest "
                     "(id, time, status, bikestands, bikes) "
                       "VALUES (%s,%s,%s,%s,%s)" )


        data_stand=(int(thing['number']), timestamp, str(thing['status']),int(thing['available_bike_stands']), int(thing['available_bikes']))



        cursor.execute(add_stand, data_stand)


    # Make sure data is committed to the database

    cnx.commit()

    cursor.close()
    cnx.close()
