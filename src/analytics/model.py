import pandas as pd
import datetime
from sklearn.ensemble import RandomForestRegressor
from sklearn.externals import joblib
import json
import getpass

class model():



    def __init__(self,from_data=False, from_pikl=False):

        self.passw = getpass.getpass('Enter db password:')





        if from_data == True:

            #create a model from data


            #get all of the bike data
            print('Collecting data: ')
            df_all = self.getandpreprocess()


            #we don't want these features in our X dataframe
            cols = [col for col in df_all.columns if col not in ['dt','time', 'index', 'id', 'icon','description', 'main', 'status','available_bikes','bike_stands','available_bike_stands','target']]

            print('building model..')
            from sklearn.ensemble import RandomForestRegressor
            self.clf=RandomForestRegressor(max_depth=50).fit(df_all[cols], df_all['target'])
            print('Saving model....')
            #save model to a pikl file
            self.piklData('model.pikl')
            print(cols)
            f=open('modelfeatures','w')
            string='['
            self.features = cols
            for col in self.features:
                string+="'"+col+"', "
            string=string[:-2]+']'
            print(string)
            f.write(string)
            f.close()

        if from_pikl==True:
            self.features = self.loadFeatures()


            #load the model from a pikl file


            self.clf = joblib.load('analytics/model.pikl')


    def loadFeatures(self):

        f=open('analytics/modelfeatures','r').read()
        return [feature[1:-1] for feature in f[1:-1].split(', ')]


    def getandpreprocess(self):
        df_bikes=pd.read_sql_table(table_name='dynamic_bikes', con='mysql://BikesMasterUser:'+self.passw+'@dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com/dublinbikes')
        df_bikes = df_bikes.drop(['index'], 1)
        def auto_truncate(val):
            return val[:20]
        df_weather1=pd.read_sql_table(table_name='weather', con='mysql://BikesMasterUser:'+self.passw+'@dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com/dublinbikes')
        df_weather2=pd.read_sql_table(table_name='dublin_weather', con='mysql://BikesMasterUser:'+self.passw+'@dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com/dublinbikes')


        df_old_weather = pd.read_csv('dublin_weather.csv', converters={'weather.description': auto_truncate})
        df_old_weather['temp']=df_old_weather['main.temp']
        df_old_weather['temp_min']=df_old_weather['main.temp_min']
        df_old_weather['humidity']=df_old_weather['main.humidity']
        df_old_weather['temp_max']=df_old_weather['main.temp_max']
        df_old_weather['pressure']=df_old_weather['main.pressure']
        df_old_weather['wind_speed']=df_old_weather['wind.speed']
        df_old_weather['wind_deg']=df_old_weather['wind.deg']
        df_old_weather['description']=df_old_weather['weather.description']
        df_old_weather['icon']=df_old_weather['weather.icon']
        df_old_weather['main']=df_old_weather['weather.main']
        df_old_weather = df_old_weather[['dt', 'temp', 'humidity', 'temp_min', 'temp_max', 'pressure', 'wind_speed', 'wind_deg', 'description', 'icon', 'main']]
        df_weather = df_weather1.append([df_weather2, df_old_weather])
        df_bikes['time']=df_bikes['time']//1000
        df_bikes['dt']=pd.to_datetime(df_bikes['time'], unit='s')
        df_bikes['hour']=df_bikes['dt'].dt.hour
        df_bikes['day']=df_bikes['dt'].dt.dayofweek
        df_bikes['month']=df_bikes['dt'].dt.month
        df_bikes['monthday']=df_bikes['dt'].dt.day
        df_bikes=df_bikes.drop(['dt','time'], 1)
        df_weather['dt']=pd.to_datetime(df_weather['dt'], unit='s')
        df_weather['hour']=df_weather['dt'].dt.hour
        df_weather['day']=df_weather['dt'].dt.dayofweek
        df_weather['month']=df_weather['dt'].dt.month
        df_weather['monthday']=df_weather['dt'].dt.day
        df_all = pd.merge(df_bikes, df_weather, on=['month', 'monthday', 'hour', 'day'], how='inner')
        df_all['target']=df_all['bike_stands']-df_all['available_bike_stands']
        features_to_concat = [df_all]

        for feature in ['description','main']:

            features_to_concat.append(pd.get_dummies(df_all[feature], prefix=feature))

        df_all = pd.concat(features_to_concat, axis=1)
        return df_all



    def piklData(self, fileLocation):
        #save data to a pikl
        from sklearn.externals import joblib

        joblib.dump(self.clf, fileLocation)


    def predict(self, object):

        #preprocess the object so we can predict from it

        #make a prediction

        row={}
        print(len(self.features))
        for feature in self.features:
            #add empty columns to the row dictionary
            row[feature]=0

        for feature in object:
            if feature in self.features and feature not in ['description', 'main']:
                row[feature]=object[feature]

            elif feature in ['description','main']:
                try:
                    row[feature+'_'+object[feature]]+=1

                #if we encounter a new value for categorical features, record it in the error log file. This is a pretty rubbish fix, but will work for now. We can check this error log to see if new weather descriptions have been encountered. The next time we build the model, it will include these new descriptions as dummies anyway, so all is not lost.
                except:
                    IndexError
                    f=open('modelerrorlog.log','a')
                    f.write('encountered new valu for '+str(feature)+' : '+object[feature])




        row = pd.DataFrame([row], columns=row.keys())
        #convert dummies to dummie

        return self.clf.predict(row)[0]

if __name__ == '__main__':

    m = model(from_data=True)
