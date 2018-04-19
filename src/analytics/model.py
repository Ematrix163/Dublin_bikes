import pandas as pd
import datetime
from sklearn.ensemble import RandomForestRegressor
from sklearn.externals import joblib
import json
import getpass
from db import getconfig
from sqlalchemy import create_engine


class model():



    def __init__(self,from_data=False, from_pikl=False):

        if from_data == True:
            self.trainModel()

        if from_pikl==True:

            try:
                self.features = self.loadFeatures()
            except:
                print('missing model feature docs')

            try:
                self.clf = joblib.load('analytics/model.pikl')

            except:
                print('Missing .pikl file. Building model from data instead.')
                self.trainModel()

    def trainModel(self):

        print('Collecting data: ')
        df_all = self.getandpreprocess()
        #we don't want these features in our X dataframe
        cols = [col for col in df_all.columns if col not in ['dt','time', 'index', 'id', 'icon','description', 'main', 'status','available_bikes','bike_stands','available_bike_stands','target', 'day', 'hour', 'number']]

        print('Training model..')

        from sklearn.ensemble import RandomForestRegressor
        self.clf=RandomForestRegressor(max_depth=100).fit(df_all[cols], df_all['target'])

        print('Saving model to pikl....')
        #save model to a pikl file
        self.piklData('analytics/model.pikl')
        #save model features in json format
        print('Writing model feature names to file')
        f=open('analytics/modelfeatures','w')
        f.write(json.dumps(cols))
        f.close()

    def loadFeatures(self):
        '''Load saved model features from disk'''
        f=open('analytics/modelfeatures','r').read()
        features = json.loads(f)
        f.close()
        return features['features']


    def getandpreprocess(self):
        '''Download data, clean and merge it into one table that can be used to train the model'''

        #set up connection and download db resources
        params = getconfig.getConfig()
        connstring = 'mysql+pymysql://'+params['user']+':'+params['passw']+'@'+params['host']+'/dublinbikes'
        engine = create_engine(connstring)
        df_bikes=pd.read_sql_table(table_name='dynamic_bikes', con=engine)
        df_bikes = df_bikes.drop(['index'], 1)

        df_weather1=pd.read_sql_table(table_name='weather', con=engine)
        #resample this first weather table so that we have a value for every hour.
        df_weather1['dt']=pd.to_datetime(df_weather1['dt'], unit='s')
        df_weather1.set_index('dt', inplace=True)
        df_weather1=df_weather1.resample('H').ffil()


        df_weather2=pd.read_sql_table(table_name='dublin_weather', con=engine)
        df_weather2['dt']=pd.to_datetime(df_weather2['dt'], unit='s')
        def auto_truncate(val):
            return val[:20]
        #load old weather table and clip all of the strings that are longer than Varchar(20)
        df_old_weather = pd.read_csv('analytics/dublin_weather.csv', converters={'weather.description': auto_truncate})

        print('Cleaning weather tables')
        #rename columns in old weather table
        df_old_weather['dt']=pd.to_datetime(df_old_weather['dt'], unit='s')
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
        print('Concacatenating weather tables')
        #Splice weather tables together
        df_weather = df_weather1.append([df_weather2, df_old_weather])
        print('Cleaning bike data')
        #extract times information from bikes
        df_bikes['time']=df_bikes['time']//1000
        df_bikes['dt']=pd.to_datetime(df_bikes['time'], unit='s')
        df_bikes['hour']=df_bikes['dt'].dt.hour
        df_bikes['day']=df_bikes['dt'].dt.dayofweek
        df_bikes['month']=df_bikes['dt'].dt.month
        df_bikes['monthday']=df_bikes['dt'].dt.day
        df_bikes=df_bikes.drop(['dt','time'], 1)
        #extract time information from weather

        df_weather['hour']=df_weather['dt'].dt.hour
        df_weather['day']=df_weather['dt'].dt.dayofweek
        df_weather['month']=df_weather['dt'].dt.month
        df_weather['monthday']=df_weather['dt'].dt.day
        #merge tables on the time information
        print('Merging tables')
        df_all = pd.merge(df_bikes, df_weather, on=['month', 'monthday', 'hour', 'day'], how='inner')

        #create a target feature
        df_all['target']=df_all['bike_stands']-df_all['available_bike_stands']

        #create dummy features for all categorical features
        features_to_concat = [df_all]
        print('Creating dummy features')
        for feature in ['description','main', 'hour', 'day', 'number']:

            features_to_concat.append(pd.get_dummies(df_all[feature], prefix=feature))

        df_all = pd.concat(features_to_concat, axis=1)
        #return the new df
        return df_all



    def piklData(self, fileLocation):
        '''Save the model to a pikl file that can be reloaded'''
        #save data to a pikl
        from sklearn.externals import joblib

        joblib.dump(self.clf, fileLocation)


    def predict(self, object):

        '''Make a prediction, given a dictionary of data points.'''

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

            elif feature in ['description','main','hour','day','number']:
                try:
                    row[feature+'_'+str(object[feature])]+=1

                #if we encounter a new value for categorical features, record it in the error log file. This is a pretty rubbish fix, but will work for now. We can check this error log to see if new weather descriptions have been encountered. The next time we build the model, it will automatically include these new descriptions as dummies anyway, so all is not lost.
                except:
                    IndexError
                    f=open('modelerrorlog.log','a')
                    f.write('encountered new valu for '+str(feature)+' : '+str(object[feature]))
                    f.close()


        #convert dictionary to dataframe

        row = pd.DataFrame([row], columns=row.keys())


        return self.clf.predict(row)[0]

    def predictMass(self, d):

        new_dict = {}
        #create an empty dictionary with every value set to 0
        for feature in self.features:
            new_dict[feature]=[0 for i in range(len(d['day']))]

        for feature in d:

            if feature in self.features and feature not in ['description', 'main', 'hour', 'day', 'number']:
                new_dict[feature]=d[feature]

            else:

                for index, f in enumerate(d[feature]):

                    try:
                        new_dict[feature + '_' + str(f)][index]=1

                    except:
                        IndexError

                        filename=open('modelerrorlog.log','a')
                        filename.write('encountered new valu for '+str(feature)+' : '+str(f))
                        filename.close()

                        filename = open('modelerrorlog.log','a')
                        filename.write('encountered new valu for '+str(feature)+' : '+str(f))

        #convert to dictionary

        df = pd.DataFrame(new_dict, columns=new_dict.keys())

        return [value for value in self.clf.predict(df)]

if __name__ == '__main__':

    m = model(from_data=True)
