import os
from app import app

def run():
	'''run the app. Access data via api,
	or view at :5000/
	or :5000/circles'''

	app.run(host='0.0.0.0', port = 5000)


if __name__ == "__main__":




	app.run(host='0.0.0.0', port = 5000)
