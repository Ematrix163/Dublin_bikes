'''
Date: 2018-03-22
Because here we want to get the data from openweatherapi and bike stations, I use multiprocessing to get data.
The frequency of getting weather is one time per hour and getting bike sations is one time 5 miniutes.
'''

from multiprocessing import Process
import requests
import json
import time
import mysql.connector
from analytics import model
from db import query, keyring




def buildModel(sleeptime):
    '''Rebuilds the RandomForestRegressor model with the most up to date data'''
    while True:
        m=model.model(from_data=True)
        del(m)
        time.sleep(sleeptime)



def scrape(url, sleeptime, f):

    '''Scrapes data from a url and applies a named function f to it.'''

    while True:
        #run this forever
        try:
            data = requests.get(url)
            data = json.loads(data.text)
            f(data)
        #wait sleeptime before scraping again
            time.sleep(sleeptime)

        except:

            print('request failed')


def insertWeather(rawData):
    '''Inserts weather data from the open weather api into our database'''

    if rawData['cod'] == '200':
        dt = rawData['list'][0]['dt']
        # connect to the database
        cnx = query.makeCnx()
        cursor = cnx.cursor()
        cursor.execute('SELECT dt FROM weather where dt = %s', (dt,))
        # The id is dt
        # This is to check whether the data has been added or not
        exist = cursor.fetchall()
        # if the data hasn't been added
        if (not exist):
            # Insert the data to the database
            query = 'INSERT INTO weather (dt, temp, pressure, humidity, temp_min, temp_max, wind_speed, wind_deg, description, icon, main) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
            data = rawData['list'][0]

            para = (dt, data['main']['temp'], data['main']['pressure'], data['main']['humidity'], data['main']['temp_min'], data['main']['temp_max'], data['wind']['speed'], data['wind']['deg'], data['weather'][0]['description'], data['weather'][0]['icon'], data['weather'][0]['main'])

            cursor.execute(query, para)
            cnx.commit()
        cursor.close()
        cnx.close()



def insertLiveDB(data):

    '''Inserts new stand data (from the bikes api) into the database. Used by webscraper.
    Much of this code was copy pasted from mysql.com'''

    global psd

    cnx = query.makeCnx()
    cursor = cnx.cursor()

    for thing in data:

        cursor.execute('SELECT time, number From dynamic_bikes WHERE time=%s AND number=%s', (thing['last_update'], thing['number']))

        #upload each entry
        add_stand = ("INSERT INTO dynamic_bikes"
                     "(time, number, status, bike_stands, available_bike_stands, available_bikes) "
                       "VALUES (%s, %s, %s, %s, %s, %s)" )

        exist = cursor.fetchall()

        if (not exist):

            data_stand=(thing['last_update'], thing['number'], thing['status'], thing['bike_stands'], thing['available_bike_stands'], thing['available_bikes'])
            cursor.execute(add_stand, data_stand)

    # Make sure data is committed to the database
            cnx.commit()
    cursor.close()
    cnx.close()


def main():

    # I use multiprocess here because we don't need to get whether data every 5 minutes

    # get the whether data every 3 hour
    weather = Process(target=scrape, args=('http://api.openweathermap.org/data/2.5/find?q=Dublin&units=imperial&type=accurate&mode=json&APPID='+keyring.getWeatherKey(), 3600, insertWeather))

    # get bike stations every 5 minutes
    stands = Process(target=scrape, args=('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey='+keyring.getBikeKey(), 300, insertLiveDB))

    models = Process(target=buildModel, args=(604800))

    weather.start()
    stands.start()
    models.start()

    weather.join()
    stands.join()
    models.join()

if __name__ == '__main__':
    main()
