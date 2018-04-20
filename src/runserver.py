

def run():
	'''run the app. Access data via api,
	or view at :5000/
	or :5000/circles'''
	from app import app
	app.run()







if __name__ == "__main__":
	import os

	print('Checking for model file..')

	if not os.path.isfile("analytics/model.pikl"):

		print('No model located. Building model.')
		from analytics import model
		m=model.model(from_data=True)
		del(m)

	else:
		print('Model found. Starting server...')

	#method copied straight from https://stackoverflow.com/questions/11125196/python-flask-open-a-webpage-in-default-browser
	import threading, webbrowser

	select_port=False

	while not select_port:

		try:
			port = int(input('Please enter a port for the app to run on?'))
			select_port = True
		except:
			print('please enter an integer')

	yesno=False
	while not yesno:

		answer = input('Do you wish to open a browser window on server launch?')
		if answer=='y':
			answer=True
			yesno=True
		elif answer=='b':
			answer=False
			yesno=True




	url = "http://0.0.0.0:{0}".format(port)

	if answer:
		threading.Timer(5, lambda: webbrowser.open(url) ).start()

	from app import app
	app.run(host='0.0.0.0', port=port)
