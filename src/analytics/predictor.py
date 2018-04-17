from analytics import model
import requests
import datetime
import json
import pandas as pd
from db import query,keyring
import time as timemodule
from math import inf
import datetime
from analytics import distances

class predictor():

    def __init__(self, static_locations):
        #load the most recent saved model
        print('Loading model from pikl')
        self.model = model.model(from_pikl=True)
        #get weather forecast
        self.weatherKey=keyring.getWeatherKey()
        print('Grabbing five day weather forecast')
        self.updateWeather()
        self.static_stands = static_locations
        self.target_coords = []
        self.stands_index = []

        for stand_number in self.static_stands:

            self.stands_index.append(stand_number)

            self.target_coords.append({'lat':self.static_stands[stand_number]['lat'], 'long':self.static_stands[stand_number]['long']})



    def predict(self, stand, timestamp, matchingweather = None):

        '''Takes a stand and a timestamp, and tries to predict stand occupancy at the given time. Matchingweather should be supplied as a parameter when a group of stands are being queried for the same timestamp. It will reduce the required computation '''

        time=datetime.datetime.fromtimestamp(timestamp)
        if matchingweather == None:
            weather = self.findMatchingWeather(time)
            if weather == None:
                print('Sorry, can\'t obtain weather forecast data for that timestamp. Please keep timestamps within 120 hours of the current time')
                return None
        else:
            weather = matchingweather

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

        '''Will return a dictionary of data points giving the estimated number of bikes and stands across a specified range'''

        time = begin

        s = query.queryStandNumber(stand)

        for i in s:
            obj1 = s[i]

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
    def predictEnMasse(self, stands, timestamps):

        time=datetime.datetime.fromtimestamp(timestamp)
        weather = self.findMatchingWeather(time)
        d={'number':[], 'humidity':[], 'hour':[],'monthday':[],'day':[], 'month':[], 'pressure':[], 'temp_max':[], 'temp_min':[], 'main':[], 'description':[], 'wind_speed':[]}
        for stand in stands:
            d = {'number':stand}
            d['humidity'].append(weather['main']['humidity'])
            d['hour'].append(time.hour)
            d['monthday'].append(time.day)
            d['day'].append(time.weekday())
            d['month'].append(time.month)
            d['pressure'].append(weather['main']['pressure'])
            d['temp'].append(weather['main']['temp'])
            d['temp_max'].append(weather['main']['temp_max'])
            d['temp_min'].append(weather['main']['temp_min'])
            d['main'].append(weather['weather'][0]['main'])
            d['description'].append(weather['weather'][0]['description'])
            #d['wind_deg']=weather['wind']['deg']
            d['wind_speed'].append(weather['wind']['speed'])

        return self.model.predictMass(d)








    def findMatchingWeather(self, time1):

        '''Matches weather data with the given timestamp'''

        #match weather data from forecast with the time given

        for object in self.weatherData['list']:

            time2 = datetime.datetime.fromtimestamp(object['dt'])

            if time2.day == time1.day and (time2.hour >= time1.hour -3 or time2.hour <=  time1.hour + 3):

                return object



        return None

    def updateWeather(self):
        '''Updates the predictors weather forecast'''
        self.weatherData=json.loads(requests.get('http://api.openweathermap.org/data/2.5/forecast?id=5344157&units=imperial&mode=json&APPID='+self.weatherKey).text)

    def getClosestStand(self, origin, transportMode='walking'):

        '''Will try to use the predictive model to find the best stand for a user, given their transport mode and origin.'''

        closestDuration = inf
        lat1 = origin['lat']
        long1 = origin['long']



        time=int(timemodule.time())
        #as we're relying on a forecast, we need to add a little bit to the matching weather time here. This should be fixed by changing the weather method to also grab current weather.
        dtime=datetime.datetime.fromtimestamp(time+1200)
        closest_index = 0

        #come on. All the weather should be just about the same. We will save time here by using the same weather data for all queries.

        weather=self.findMatchingWeather(dtime)
        print(weather)







        data = distances.getAllDistancesInOneApiCall({'lat':lat1, 'long':long1}, self.target_coords, transportMode)

        for index, location in enumerate(data['rows'][0]['elements']):
            if transportMode == 'walking':

                if location['duration']['value']<closestDuration and self.predict(int(self.stands_index[index]), time+3600+location['duration']['value'], matchingweather=weather) >=5:
                    closest_index = index
                    closestDuration = location['duration']['value']

            else:

                if location['duration']['value']<closestDuration and self.predict(int(self.stands_index[index]), time+location['duration']['value'],matchingweather=weather) <=25:
                    closest_index = index
                    closestDuration = location['duration']['value']





        return self.target_coords[closest_index]




if __name__ == '__main__':

    pre=predictor()
    while True:
        a=int(input('please enter a stand number'))
        b=int(input('please enter a timestamp: '))

        print(pre.predict(a,b))
