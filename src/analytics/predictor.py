from analytics.model import model
import requests
import datetime
import json
import pandas as pd

class predictor():

    def __init__(self):
        #load the most recent saved model
        self.model = model(from_pikl=True)
        #get weather forecast
        self.weatherData=json.loads(requests.get('http://api.openweathermap.org/data/2.5/forecast?id=5344157&units=imperial&mode=json&APPID=def5ec12072a2e8060e27a30bdbebb2e').text)



    def predict(self, stand, timestamp):
        time=datetime.datetime.fromtimestamp(timestamp)
        weather = self.findMatchingWeather(time)
        d = {'number':stand}
        d['humidity'] = weather['main']['humidity']
        d['hour']=time.hour
        d['day']=time.weekday()
        d['month']=time.month
        d['pressure']=weather['main']['pressure']
        d['temp']=weather['main']['temp']
        d['temp_max']=weather['main']['temp_max']
        d['temp_min']=weather['main']['temp_min']
        d['wind_deg']=weather['wind']['deg']
        d['wind_speed']=weather['wind']['speed']
        print(d)
        object = pd.DataFrame([d], columns=d.keys())
        return self.model.predict(object)





    def findMatchingWeather(self, time1):

        for object in self.weatherData['list']:

            time2 = datetime.datetime.fromtimestamp(object['dt'])

            if time2.day == time1.day and (time2.hour >= time1.hour -3 or time2.hour <=  time1.hour + 3):

                return object



        return None

if __name__ == '__main__':

    pre=predictor()
    print(pre.predict(42, 1523473267))
