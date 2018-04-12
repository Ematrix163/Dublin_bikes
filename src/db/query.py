import datetime
import mysql.connector
import time
import json as js
import getpass
global passw

passw = getpass.getpass('Enter db password:')




def queryStandNumber(x):
    '''gets all historical information about a specific stands occupancy


    by supplying time parameters, it can also get information within a timeframe'''

    #takes a key, and a value for the key
    #returns all the rows who match that key

    #basically ripped from
    #https://dev.mysql.com/doc/connector-python/en/connector-python-example-cursor-select.html


    cnx = mysql.connector.connect(user='BikesMasterUser',\
    database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
    port = 3306, password = passw )
    cursor = cnx.cursor()

#this can be changed to reflect any query we like

    query = ("SELECT time, available_bikes, available_bike_stands, bike_stands, status FROM dynamic_bikes WHERE number = "  + str(x))



    cursor.execute(query)

#should change to return data in json like format

    json={}
    for (arr) in cursor:
        json[arr[0]] ={'bikes': arr[1], 'spaces' : arr[2]}

    cursor.close()
    cnx.close()

    return json






def queryCurrentStands():

    global passw

    '''returns current stand occupancy data for all stands'''


    cnx = mysql.connector.connect(user='BikesMasterUser',\
    database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
    port = 3306, password = passw )
    cursor = cnx.cursor()

    #choose the closest time's data of all stations
    query = ("SELECT time, status, number, available_bikes, available_bike_stands FROM dynamic_bikes GROUP BY (number) HAVING MAX(time)")


    cursor.execute(query)

    #should change to return data in json like format

    json={}

	# traverse the outcome and record it
    for (arr) in cursor:
        json[arr[2]] = {'time':arr[0], 'status': arr[1],'bikes' : arr[3], 'spaces' : arr[4]}

    cursor.close()
    cnx.close()
    return json







def queryStaticLocations():
	global passw

	''' gets name, address and coordinates for all stands '''

	cnx = mysql.connector.connect(user='BikesMasterUser',\
	database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
	port = 3306, password = passw)
	cursor = cnx.cursor()

	#this can be changed to reflect any query we like

	query = ("SELECT standid, name, address, lat, longitude  FROM bikestands ")

	cursor.execute(query)

	# I've changed the type here because it is easy for me to loop the list in js
	json = {}
	for (arr) in cursor:
	    json[arr[0]] = {'name' : arr[1], 'address' : arr[2], 'lat': arr[3], 'long':arr[4]}


	cursor.close()
	cnx.close()

	return json




def queryWeather():

	global passw

	'''
	The function is to get the weather information
	'''

	cnx = mysql.connector.connect(user='BikesMasterUser',\
	database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
	port = 3306, password = passw)
	cursor = cnx.cursor()


	json={}

	# get the weather data
	weather = ("SELECT MAX(dt), temp, pressure, humidity, temp_min, temp_max, wind_speed, wind_deg, description, icon, main FROM weather")
	cursor.execute(weather)

	# append the weather data to the database
	for column in cursor:
		json['weather'] = {'temp': column[1], 'pressure': column[2], 'humidity':column[3], \
		'temp_min':column[4], 'temp_max':column[5], 'wind_speed':column[6], 'wind_deg':column[7],\
		 'description':column[8], 'icon':column[9], 'main':column[10]}

	cursor.close()
	cnx.close()

	return json

if __name__=='__main__':
    #test all methods
#
   print(queryStandNumber(5))
#    print(queryCurrentStands())
    # print(queryStaticLocations())
