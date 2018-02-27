from __future__ import print_function
from datetime import date, datetime, timedelta
import mysql.connector
import json

import time
import requests


def insertDB(data, timestamp):
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


def scrape():
    '''simple, naive method for getting api data and saving it in .txt form - every five minutes + uploading it to db'''
    while True:
        #run this forever
        t=time.time()
        f=open('data_in_text_form/'+str(time.time()) + '_bikedata.txt', 'w')
        data = requests.get('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=80b7eeead410f23a165f6d67bc9d33e514e8ee84')
        f.write(data.text)

        f.close()
        data = json.loads(data.text)
        insertDB(data, t)


        #Here we're getting the weather data. Currently not uploading this
        #to db, as I have no idea what the table should look like
        f=open('data_in_text_form/'+str(time.time()) + '_weather_data.txt', 'w')
        data = requests.get('http://api.openweathermap.org/data/2.5/find?q=Dublin&units=imperial&type=accurate&mode=json&APPID=def5ec12072a2e8060e27a30bdbebb2e')
        f.write(data.text)
        f.close()
        time.sleep(300)

if __name__ == '__main__':
    passw = input('please enter db password: ')
    scrape()
