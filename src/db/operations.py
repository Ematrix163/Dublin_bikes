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

psd = '100pinkElephants'

def scrape(url, sleeptime, f):
    while True:
        #run this forever
        data = requests.get(url)
        data = json.loads(data.text)
        f(data)
        #wait sleeptime before scraping again
        time.sleep(sleeptime)
        
        
def insertWeather(rawData):
    
    global psd
    if rawData['cod'] == '200':
        dt = rawData['list'][0]['dt']
        # connect to the database
        cnx = mysql.connector.connect(user='BikesMasterUser',\
              database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
              port = 3306, password = psd)
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
    
    '''inserts new stand data (from the bikes api) into the database. Used by webscraper.
    Largely composed of copypasta from mysql.com/stack overflow'''
    
    global psd

    cnx = mysql.connector.connect(user='BikesMasterUser',\
    database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
    port = 3306, password = psd )
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
    weather = Process(target=scrape, args=('http://api.openweathermap.org/data/2.5/find?q=Dublin&units=imperial&type=accurate&mode=json&APPID=def5ec12072a2e8060e27a30bdbebb2e', 10800, insertWeather))
    
    # get bike stations every 5 minutes
    stands = Process(target=scrape, args=('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=80b7eeead410f23a165f6d67bc9d33e514e8ee84', 300, insertLiveDB))
    
    weather.start()
    stands.start()
    weather.join()
    stands.join()    
    
    
if __name__ == '__main__':
    main()
  
