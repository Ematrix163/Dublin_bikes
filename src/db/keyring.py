'''Simple methods for returning api keys from stored .config file'''


def getMapKey():
    '''Returns the google maps api key'''

    f=open('keys.config').read().split('\n')
    return f[0].split(' ')[1]

def getDistanceKey():
    '''Returns the google distance matrix api key'''
    f=open('keys.config').read().split('\n')
    return f[2].split(' ')[1]


def getWeatherKey():
    '''Returns the openweathermaps api key'''
    f=open('keys.config').read().split('\n')
    return f[1].split(' ')[1]

def getBikeKey():
    '''Returns the JCDecaux dublin bikes api key'''
    f=open('keys.config').read().split('\n')
    return f[3].split(' ')[1]

def getDistanceKey2():
    f=open('keys.config').read().split('\n')
    return f[4].split(' ')[1]
