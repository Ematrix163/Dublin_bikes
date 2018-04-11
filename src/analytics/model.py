class model():



    def __init__(self,data=None, pikl=None):

        if pikl == None:
            import pandas as pd

            from sklearn.externals import joblib
            df_bikes = pd.read_csv('bikesandweather.csv')
            df_bikes=df_bikes.drop('Unnamed: 0', axis=1)
            df_bikes['target'] = df_bikes['available_bikes']-df_bikes['available_bike_stands']
            df_bikes=df_bikes.drop(['available_bike_stands', 'available_bikes'], axis=1)
            cols = [col for col in df_bikes.columns if col not in ['target', 'main', 'description', 'icon', 'status']]
            from sklearn.ensemble import RandomForestRegressor
            self.clf=RandomForestRegressor(max_depth=50).fit(df_bikes[cols], df_bikes['target'])




    def getData(self):


        pass


    def preprocess(self, data):

        pass


    def piklData(self, fileLocation):

        joblib.dump(self.clf, fileLocation)


    def predict(self, row):


        return self.clf.predict(row)[0]

if __name__ == '__main__':

    m = model()
