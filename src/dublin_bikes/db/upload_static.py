
#copied from https://dev.mysql.com/doc/connector-python/en/connector-python-example-cursor-transaction.html

from __future__ import print_function
from datetime import date, datetime, timedelta
import mysql.connector
import json
data = json.load(open('dublin-bikes-api-static-data.json'))
passw = input('please enter the password for this database:')
cnx = mysql.connector.connect(user='BikesMasterUser',\
database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
port = 3306, password = passw )
cursor = cnx.cursor()

for thing in data:


    #upload each entry
    add_stand = ("INSERT INTO bikestands "
                 "(standid, name, address, lat, longitude) "
                   "VALUES (%s,%s,%s,%s,%s)" )


    data_stand=(int(thing['number']),str(thing['name']), str(thing['address']), float(thing['latitude']),float(thing['longitude']))
    print(data_stand)

    # Insert new employee
    cursor.execute(add_stand, (int(thing['number']),str(thing['name']), str(thing['address']), float(thing['latitude']),float(thing['longitude'],)))


# Make sure data is committed to the database

cnx.commit()

cursor.close()
cnx.close()
