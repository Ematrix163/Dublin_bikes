import datetime
import mysql.connector

def queryStandNumber(x, key='id'):
'''basic query function for database '''

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

if __name__=='__main__':

    queryStandNumber(5)
