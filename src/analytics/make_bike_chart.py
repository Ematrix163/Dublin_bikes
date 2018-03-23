from matplotlib import pyplot as pyplot
from dublin_bikes.db import simple_query as query
import time
'''I don't think this approach is going to work. I mean,
we could pre render the analytics as images, and somehow send them,
through the flask app, a) I don't see how we'd do this,
and b) maybe we can just use javascript to render them anyway?'''


def make_stand_chart(stand, timeFrame=[o, time.time()]):

    data = query.queryStandNumber(stand, timeFrame)

    #py plot this data....
    # should be returned like this'


    #stand, time,  bank   bonus status spaces bikes
    #[5, 1519847210, 'F', 'F', 'CLOSED', 2, 38]
