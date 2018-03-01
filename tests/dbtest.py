''' test inserting and getting rowds

Add more descriptions....


 '''

#how do we test if the db tests actually work?

from db import simple_query

print(simple_query.queryStandNumber(5))
print(queryCurrentStands())
    #what happens when we test a stand that isn't in the db?
print(simple_query.queryStandNumber(200))

n=100
while n>0:

        #what happens when we make a ridiculous amount of requests
simple_query.queryStandNumber(n)
n<=1



#to do -->
#also = what happens when more than one computer is running this testing script at the same time?
