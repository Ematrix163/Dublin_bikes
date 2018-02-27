import time
import requests

def scrape():
    '''simple, naive method for getting api data and saving it in .txt form - every five minutes'''
    while True:
        f=open('data_in_text_form/'+str(time.time()) + '_bikedata.txt', 'w')
        data = requests.get('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=80b7eeead410f23a165f6d67bc9d33e514e8ee84')
        f.write(data.text)
        f.close()
        f=open('data_in_text_form/'+str(time.time()) + '_weather_data.txt', 'w')
        data = requests.get('http://api.openweathermap.org/data/2.5/find?q=Dublin&units=imperial&type=accurate&mode=json&APPID=def5ec12072a2e8060e27a30bdbebb2e')
        f.write(data.text)
        f.close()
        time.sleep(300)

if __name__ == '__main__':

    scrape()
