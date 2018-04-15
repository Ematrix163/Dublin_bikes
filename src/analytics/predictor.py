from analytics import model
import requests
import datetime
import json
import pandas as pd
from db import query,keyring

class predictor():

    def __init__(self):
        #load the most recent saved model
        self.model = model.model(from_pikl=True)
        #get weather forecast
        self.weatherKey=keyring.getWeatherKey()
        self.updateWeather()



    def predict(self, stand, timestamp):
        time=datetime.datetime.fromtimestamp(timestamp)
        weather = self.findMatchingWeather(time)
        if weather == None:
            print('Sorry, can\'t obtain weather forecast data for that timestamp. Please keep timestamps within 120 hours of the current time')
            return None

        d = {'number':stand}
        d['humidity'] = weather['main']['humidity']
        d['hour']=time.hour
        d['monthday']=time.day
        d['day']=time.weekday()
        d['month']=time.month
        d['pressure']=weather['main']['pressure']
        d['temp']=weather['main']['temp']
        d['temp_max']=weather['main']['temp_max']
        d['temp_min']=weather['main']['temp_min']
        d['main']=weather['weather'][0]['main']
        d['description']=weather['weather'][0]['description']
        #d['wind_deg']=weather['wind']['deg']
        d['wind_speed']=weather['wind']['speed']


        #need to add description and main as well
        return self.model.predict(d)

    def predictRange(self, stand, begin, end):

        time = begin

        s = query.queryStandNumber(stand)
        print(s)
        for i in s:
            obj1 = s[i]
        print(obj1)
        d={'times':[], 'bikes':[], 'spaces':[]}
        found = False
        while time <= end:

            prediction = self.predict(stand, time)
            #how will we resolve 'none' results?
            if prediction != None:
                d['times'].append(time)
                d['bikes'].append(int(prediction))
                d['spaces'].append(int(obj1['bike_stands'])-int(prediction))
                found = True

            elif found == True:
                #don't keep on seaching after this point
                break

            #add another hour
            time += 3600

        return d









    def findMatchingWeather(self, time1):
        #match weather data from forecast with the time given
        for object in self.weatherData['list']:

            time2 = datetime.datetime.fromtimestamp(object['dt'])

            if time2.day == time1.day and (time2.hour >= time1.hour -3 or time2.hour <=  time1.hour + 3):

                return object



        return None

    def updateWeather(self):

        self.weatherData=json.loads(requests.get('http://api.openweathermap.org/data/2.5/forecast?id=5344157&units=imperial&mode=json&APPID='+self.weatherKey).text)



if __name__ == '__main__':

    pre=predictor()
    while True:
        a=int(input('please enter a stand number'))
        b=int(input('please enter a timestamp: '))

        print(pre.predict(a,b))
