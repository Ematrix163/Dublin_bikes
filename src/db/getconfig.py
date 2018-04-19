def getConfig():

    '''Gets all database parameters from file and returns them in dictionary format'''

    f=open('config.config','r').read().split('\n')
    d={}
    d['database']=f[1]
    d['user']=f[0]
    d['host']=f[2]
    d['port']=int(f[3])
    d['passw']=f[4]

    return d
