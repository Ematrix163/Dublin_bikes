
import json
from db import inserts as inserts
import time
import requests





def scrape():
    '''simple, naive method for getting api data
     Scrapes data every five minutes and uploads it to db
     Due to time lost uploading, it might not actually scrape every
     five minutes.
     To do - make weather database.'''
    waittime=0
    while True:
        #run this forever

        try:
            t=time.time()

            data = requests.get('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=80b7eeead410f23a165f6d67bc9d33e514e8ee84')

            waittime += 300

            data = json.loads(data.text)
            print(data)

            inserts.insertLiveDB(data, t)


            #Here we're getting the weather data. Currently not uploading this
            #to db, as I have no idea what the table should look like


            if waittime >= 10800:

                data = requests.get('http://api.openweathermap.org/data/2.5/find?q=Dublin&units=imperial&type=accurate&mode=json&APPID=def5ec12072a2e8060e27a30bdbebb2e')
                insertWeather(data)
                waittime = 0





            #wait five minutes before scraping again
            time.sleep(300)
        except:
            print('failed request')




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

if __name__ == '__main__':
    
    scrape()
