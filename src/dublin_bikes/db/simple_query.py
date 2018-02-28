import datetime
import mysql.connector
import time

def queryStandNumber(x, key='id'):
    '''gets all historical information about a specific stands occupancy'''

    #takes a key, and a value for the key
    #returns all the rows who match that key

    #basically ripped from
    #https://dev.mysql.com/doc/connector-python/en/connector-python-example-cursor-select.html

    passw=input('please enter password for the db: ')
    cnx = mysql.connector.connect(user='BikesMasterUser',\
    database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
    port = 3306, password = passw )
    cursor = cnx.cursor()

#this can be changed to reflect any query we like

    query = ("SELECT * FROM testtest "
             "WHERE " +key+" = " + str(x))



    cursor.execute(query)

#should change to return data in json like format

    big_arr=[]
    for (arr) in cursor:
        big_arr.append([arr[0], arr[1], arr[2], arr[3], arr[4]])

    print(big_arr)


    cursor.close()
    cnx.close()
    return arr

def queryCurrentStands():
    '''seems to return most recent stands'''
    t = time.time()
    t1 = t+250
    t2 = t - 250

        #takes a key, and a value for the key
        #returns all the rows who match that key

        #basically ripped from
        #https://dev.mysql.com/doc/connector-python/en/connector-python-example-cursor-select.html

    passw=input('please enter password for the db: ')
    cnx = mysql.connector.connect(user='BikesMasterUser',\
    database='dublinbikes', host='dublinbikes-chen-diarmuid-louis.cxt07zwifclj.us-west-2.rds.amazonaws.com',\
    port = 3306, password = passw )
    cursor = cnx.cursor()

    #this can be changed to reflect any query we like

    query = ("SELECT * FROM testtest "
            "WHERE time < " + str(t1) + " and time > "+ str(t2))



    cursor.execute(query)

    #should change to return data in json like format

    big_arr=[]
    for (arr) in cursor:
        big_arr.append([arr[0], arr[1], arr[2], arr[3], arr[4]])

    print(big_arr)


    cursor.close()
    cnx.close()
    return arr

if __name__=='__main__':

    queryStandNumber(5)
    queryCurrentStands()
