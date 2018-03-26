
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
    while True:
        #run this forever
        t=time.time()

        data = requests.get('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=80b7eeead410f23a165f6d67bc9d33e514e8ee84')



        data = json.loads(data.text)
        print(data)

        inserts.insertLiveDB(data, t)


        #Here we're getting the weather data. Currently not uploading this
        #to db, as I have no idea what the table should look like

        data = requests.get('http://api.openweathermap.org/data/2.5/find?q=Dublin&units=imperial&type=accurate&mode=json&APPID=def5ec12072a2e8060e27a30bdbebb2e')



        #wait five minutes before scraping again
        time.sleep(300)

if __name__ == '__main__':
    passw = input('please enter db password: ')
    scrape()
