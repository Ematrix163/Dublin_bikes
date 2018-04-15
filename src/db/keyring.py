def getMapKey():

    f=open('keys.config').read().split('\n')
    return f[0].split(' ')[1]

def getDistanceKey():
    f=open('keys.config').read().split('\n')
    return f[2].split(' ')[1]


def getWeatherKey():
    f=open('keys.config').read().split('\n')
    return f[1].split(' ')[1]
