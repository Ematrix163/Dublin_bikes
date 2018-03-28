## Api Documentations 

** 1) Distances *

``` /distance?origin=lat,long1

```

Used to find the closest bikestand to the user.
If no origin is specified, defaults to UCD's locations

*2) Graph data* /graph?stand=standNumber&day=dayNumber

Used to return graphable data, showing average stand occupancy for every hour of the stated days

*3) Request single stand*

/request?type=queryCurrentStands

Returns the current stand occupancy for all bike bike_stands

*4) Request static data*

 /request?type=queryStaticLocations

Returns the static data for every bike stand

*5) Get single stand data*

 /request?type=standNumber&begin=begintimestamp&end=endtimestamp

Returns the current stand occupancy for a single given stand between two stated times.

If these are not stated, it defaults to from the present to the beginning of time.

5) /request?type=liveData

Returns a combination of 3 and 4 e.g static data about the bike stands combined with their current occupnacy
