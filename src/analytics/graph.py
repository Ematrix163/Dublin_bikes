"""Includes methods for drawing average stand occupancy graphs"""


from db import query as query
import datetime
import time
import pandas as pd
from sqlalchemy import create_engine
import query()

def getGraphData():
    '''Downloads all of the data necessary to create daily average graphs, in one go'''
    params = query.getConfig()

    connstring = 'mysql+pymysql://'+params['user']+':'+params['passw']+'@'+params['host']+'/dublinbikes'
    engine=create_engine(connstring)
    df_bikes=pd.read_sql_table(con=engine, table_name='dynamic_bikes')
    df_bikes['time']=df_bikes['time']//1000
    df_bikes['dt']=pd.to_datetime(df_bikes['time'], unit='s')
    df_bikes['hour']=df_bikes['dt'].dt.hour
    df_bikes['day']=df_bikes['dt'].dt.dayofweek
    return df_bikes


def prepareDayOfTheWeekData(stand, dayOfWeek, data=None, fromDF=False):

    '''Returns average occupancy of a given stand, for every hour of a specified week day. If no dataframe is provided, this method will query the needed data from the database, but it is inherently wasteful. If a dataframe is provided, it will extract it from the dataframe.'''

    if fromDF == False:

        #slow wasteful method that won't work in acceptable time for larger datasets

        stand = int(stand)
        dayOfWeek = int(dayOfWeek)


        data = query.queryStandNumberFull(stand)

        json = makeEmptyJsonDayObject()

        for t in data:
            time_c = int(t)/1000
            dtime = datetime.datetime.fromtimestamp(time_c)
            hour = dtime.hour


            if dtime.weekday()==dayOfWeek:
                #if day of week is the same

                #place this data in the nearest five minute intereval

                json[hour]['bikes'].append(int(data[t]['bikes']))
                json[hour]['spaces'].append(int(data[t]['spaces']))


        response = {'spaces':[], 'bikes':[]}
        for t in json:

            #loop through the arrays, and reduce them to their average value


            if len(json[t]['bikes'])==0:
                response['bikes'].append(0)
                response['spaces'].append(0)
            else:
                response['bikes'].append(int(sum(json[t]['bikes'])/len(json[t]['bikes'])))


                response['spaces'].append(int(sum(json[t]['spaces'])/len(json[t]['spaces'])))
    else:

        df=data[(data['number']==stand) & (data['day']==dayOfWeek)]
        response={'spaces':[], 'bikes':[]}
        for hour in range(0,24):
            response['bikes'].append(df[df['hour']==hour]['available_bikes'].mean())
            response['spaces'].append(df[df['hour']==hour]['available_bike_stands'].mean())






    return response



def makeEmptyJsonDayObject():

    '''return an empty json object of form
    \{time: { bikes: array, spaces: array} .... time {bikes..... \}}'''
    import time
    json = {}
    for i in range(0, 24):

        json[i] = {'bikes':[], 'spaces':[]}


    return json
