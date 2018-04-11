class model():



    def __init__(self,from_data=False, from_pikl=False):
        self.passw=input('enter password:')
        import pandas as pd
        import datetime
        if from_data == True:


            #get all of the bike data
            df_bikes = self.getandpreprocess()


            #build a model with the columns we want
            cols = ['number', 'hour', 'day', 'month', 'monthday', 'humidity', 'pressure', 'temp', 'temp_max', 'temp_min', 'wind_speed']
            print(cols)
            from sklearn.ensemble import RandomForestRegressor
            self.clf=RandomForestRegressor(max_depth=50).fit(df_bikes[cols], df_bikes['target'])

            #save model to a pikl file
            self.piklData('model.pikl')

        if from_pikl==True:

            #load the model from a pikl file
            from sklearn.ensemble import RandomForestRegressor
            from sklearn.externals import joblib
            self.clf = joblib.load('model.pikl')





    def getData(self):


        pass


    def getandpreprocess(self):

        import pandas as pd
        #get bike data
        df_bikes=pd.read_sql_table(table_name='dynamic_bikes', con='mysql://BikesMasterUser:'+self.passw+'@dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com/dublinbikes')
        #get weather data
        df_weather=pd.read_sql_table(table_name='weather', con='mysql://BikesMasterUser:'+self.passw+'@dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com/dublinbikes')
        #add time data to bikes
        df_bikes['time']=df_bikes['time']//1000
        df_bikes['dt']=pd.to_datetime(df_bikes['time'], unit='s')
        df_bikes['hour']=df_bikes['dt'].dt.hour
        df_bikes['day']=df_bikes['dt'].dt.dayofweek
        df_bikes['month']=df_bikes['dt'].dt.month
        df_bikes['monthday']=df_bikes['dt'].dt.day

        #read in archival weather data
        df_old_weather = pd.read_csv('dublin_weather.csv')

        #merge weather tables
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

        df_wzz = df_old_weather[['dt', 'temp', 'humidity', 'temp_min', 'temp_max', 'pressure', 'wind_speed', 'wind_deg', 'description', 'icon', 'main']]

        #append
        weather = df_weather.append(df_wzz)

        #get time data for weather
        weather['time']=pd.to_datetime(weather['dt'], unit='s')
        weather['hour']=weather['time'].dt.hour
        weather['day']=weather['time'].dt.dayofweek
        weather['month']=weather['time'].dt.month
        weather['monthday']=weather['time'].dt.day

        #the columns to append to bike data
        cols=['description', 'dt','humidity', 'icon', 'main', 'pressure', 'temp', 'temp_max', 'temp_min','wind_deg', 'wind_speed']

        #set these as empty for bike data
        for col in cols:
           df_bikes[col]=0
           df_bikes[col].astype('category')

        #merge tables (key is every three hours)
        for index, row in weather.iterrows():

            month = row['month']
            day = row['monthday']
            hour = row['hour']



            if df_bikes.loc[(df_bikes['month']==month) & (df_bikes['monthday'] == day) & ((df_bikes['hour'] < hour+3) & (df_bikes['hour'] > hour -3)) , cols].shape[0] != 0:
                for col in cols:
                    df_bikes.loc[(df_bikes['month']==month) & (df_bikes['monthday'] == day) & ((df_bikes['hour'] < hour+3) & (df_bikes['hour'] > hour -3)) , col] = row[col]

        #merge again (1 hour this time)
        for index, row in weather.iterrows():

            month = row['month']
            day = row['monthday']
            hour = row['hour']



            if df_bikes.loc[(df_bikes['month']==month) & (df_bikes['monthday'] == day) & (df_bikes['hour'] == hour), cols].shape[0] != 0:
                for col in cols:
                    df_bikes.loc[(df_bikes['month']==month) & (df_bikes['monthday'] == day) & (df_bikes['hour'] == hour), col] = row[col]

        #drop bike data with no appropriate weather info
        df_bikes = df_bikes[df_bikes.description!=0]

        #make a target variable
        df_bikes['target']=df_bikes['bike_stands']-df_bikes['available_bike_stands']

        #return the dataframe
        return df_bikes

        #this is just going to be nasty

        pass


    def piklData(self, fileLocation):
        #save data to a pikl
        from sklearn.externals import joblib

        joblib.dump(self.clf, fileLocation)


    def predict(self, row):
        #make a prediction

        return self.clf.predict(row)[0]

if __name__ == '__main__':

    m = model(from_pikl=True)
