class model():



    def __init__(self,from_data=False, from_pikl=False):

        if from_data == True:
            import pandas as pd


            df_bikes = pd.read_csv('bikesandweather.csv')
            df_bikes=df_bikes.drop('Unnamed: 0', axis=1)
            df_bikes['target'] = df_bikes['available_bikes']-df_bikes['available_bike_stands']
            df_bikes=df_bikes.drop(['available_bike_stands', 'available_bikes'], axis=1)
            cols = [col for col in df_bikes.columns if col not in ['target', 'main', 'description', 'icon', 'status', 'time', 'bike_stands','dt']]
            print(cols)
            from sklearn.ensemble import RandomForestRegressor
            self.clf=RandomForestRegressor(max_depth=50).fit(df_bikes[cols], df_bikes['target'])
            self.piklData('model.pikl')

        if from_pikl==True:
            from sklearn.ensemble import RandomForestRegressor
            from sklearn.externals import joblib
            self.clf = joblib.load('model.pikl')





    def getData(self):


        pass


    def preprocess(self, data):

        pass


    def piklData(self, fileLocation):
        from sklearn.externals import joblib

        joblib.dump(self.clf, fileLocation)


    def predict(self, row):


        return self.clf.predict(row)[0]

if __name__ == '__main__':

    m = model(from_data=True)
    m.piklData('modepikl.pikl')
