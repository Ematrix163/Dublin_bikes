

def run():
	'''run the app. Access data via api,
	or view at :5000/
	or :5000/circles'''

	app.run()


if __name__ == "__main__":

	#method copied straight from https://stackoverflow.com/questions/11125196/python-flask-open-a-webpage-in-default-browser
	import random, threading, webbrowser
	select_port=False
	while not select_port:
		try:
			port = int(input('What port do you want to run the app on?'))
			select_port = True
		except:
			print('please enter an integer yo')
	url = "http://localhost:{0}".format(port)

	import os
	from app import app
	threading.Timer(1.25, lambda: webbrowser.open(url) ).start()

	app.run(host='0.0.0.0', port=port, debug=False)


	app.run()
