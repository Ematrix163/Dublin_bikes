# Dublin Bikes - Find a Bike v 2.0 20th April 2018



First release of Dublin Bikes bike finder.

To run:
1) pip install -e dublin_bikes
2) Place a valid config.config and keys.config files in the src directory.
3) (Optional) In src, run python runscraper.py to run the webscraper
4) (Optional) In src, run python updatemodel.py to update the model.
5) In src, run python runserver.py to start the server. If no model pikl is found, a model will be automatically built and saved. Enter a port number to select what port the server will run on. Answer yes/no to whether or not the website should be opened in a browser window,
