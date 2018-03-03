from __future__ import print_function
from datetime import date, datetime, timedelta

import json
from dublin_bikes.db import inserts as inserts
import time
import requests





def scrape():
    '''simple, naive method for getting api data and saving it in .txt form - every five minutes + uploading it to db'''
    while True:
        #run this forever
        t=time.time()

        data = requests.get('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=80b7eeead410f23a165f6d67bc9d33e514e8ee84')



        data = json.loads(data.text)

        inserts.insertLiveDB(data, t)


        #Here we're getting the weather data. Currently not uploading this
        #to db, as I have no idea what the table should look like

        data = requests.get('http://api.openweathermap.org/data/2.5/find?q=Dublin&units=imperial&type=accurate&mode=json&APPID=def5ec12072a2e8060e27a30bdbebb2e')




        time.sleep(300)

if __name__ == '__main__':
    passw = input('please enter db password: ')
    scrape()
