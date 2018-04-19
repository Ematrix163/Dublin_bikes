import datetime
import mysql.connector
import time
import json as js
from db import getconfig.getConfig as getConfig



def makeCnx():

    '''Creates a cnx object that can be used to access our database'''

    params= getConfig()
    cnx = mysql.connector.connect(user=params['user'],\
    database=params['database'], host=params['host'],\
    port = params['port'], password = params['passw'])

    return cnx

def queryStandNumberFull(x):

    '''Gets all historical information about a specific stand's occupancy


    '''


    cnx = makeCnx()
    cursor = cnx.cursor()

    query = ("SELECT time, available_bikes, available_bike_stands, bike_stands, status FROM dynamic_bikes WHERE number = "  + str(x))

    cursor.execute(query)

    json={}

    for (arr) in cursor:

        json[arr[0]] ={'bikes': arr[1], 'spaces' : arr[2]}

    cursor.close()
    cnx.close()

    return json




def queryStandNumber(x):
    '''Gets the most up to date information for a single bike stand


     '''

    #basically ripped from
    #https://dev.mysql.com/doc/connector-python/en/connector-python-example-cursor-select.html

    cnx = makeCnx()
    cursor = cnx.cursor()

#this can be changed to reflect any query we like

    query = ("SELECT time, available_bikes, available_bike_stands, bike_stands, status FROM dynamic_bikes WHERE number = "  + str(x))

    query = ("SELECT time, bike_stands, available_bikes, available_bike_stands, status FROM dynamic_bikes d WHERE d.time = (SELECT MAX(time) FROM dynamic_bikes d WHERE d.number = "+str(x)+") AND d.number = " +str(x))

    cursor.execute(query)

#should change to return data in json like format

    json={}
    for (arr) in cursor:
        json[arr[0]] ={ 'bike_stands' : arr[1], 'bikes' : arr[2], 'spaces': arr[3], 'status':arr[4]}

    cursor.close()
    cnx.close()

    return json



def queryCurrentStands():

    '''Returns current stand occupancy data for all stands'''

    cnx=makeCnx()
    cursor = cnx.cursor()

    #choose the closest time's data of all stations
    query = ("SELECT a.time, a.status, a.number, a.available_bikes, a.available_bike_stands, a.bike_stands FROM dynamic_bikes a INNER JOIN( SELECT MAX(time) t, number FROM dynamic_bikes b GROUP BY number )b ON a.number = b.number AND a.time = b.t")



    cursor.execute(query)

    #should change to return data in json like format

    json={}

	# traverse the outcome and record it
    for (arr) in cursor:
        json[arr[2]] = {'time':arr[0], 'status': arr[1],'bikes' : arr[3], 'spaces' : arr[4], 'bike_stands':arr[5]}

    cursor.close()
    cnx.close()

    return json







def queryStaticLocations():
	global passw

	''' Gets the name, address and coordinates of all bike stands '''

	cnx = makeCnx()
	cursor = cnx.cursor()


	query = ("SELECT standid, name, address, lat, longitude  FROM bikestands ")

	cursor.execute(query)

	json = {}
	for (arr) in cursor:
	    json[arr[0]] = {'name' : arr[1], 'address' : arr[2], 'lat': arr[3], 'long':arr[4]}


	cursor.close()
	cnx.close()

	return json




def queryWeather():


	'''
	Queries weather data from our database
	'''

    #I don't think we're actively using this query anymore as the front end now relies on directly calling the openweathermap api


	cnx = makeCnx()
	cursor = cnx.cursor()


	json={}

	# get the weather data
	weather = ("SELECT MAX(dt), temp, pressure, humidity, temp_min, temp_max, wind_speed, wind_deg, description, icon, main FROM dublin_weather")
	cursor.execute(weather)

	# append the weather data to the database
	for column in cursor:
		json['weather'] = {'temp': column[1], 'pressure': column[2], 'humidity':column[3], \
		'temp_min':column[4], 'temp_max':column[5], 'wind_speed':column[6], 'wind_deg':column[7],\
		 'description':column[8], 'icon':column[9], 'main':column[10]}

	cursor.close()
	cnx.close()

	return json
