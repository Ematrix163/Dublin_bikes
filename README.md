# Dublin Bikes - Find a Bike

###  First release V.1.0 April 2018

First release of Dublin Bikes Bike Finder.

To run:

1. install all requirements

   `pip install -r requirements.txt`

2.  **Place a valid `config.config` and `keys.config` files in the src directory.**

3.  **In src, enter the following command**

	`python runserver.py`

	Then it will prompt you a port number (if you want to use the port number between 0 and 1023, you have to be the super user of your system.)

4. (Optional) In src, run python runscraper.py to run the webscraper

5. (Optional) In src, run python updatemodel.py to update the model.

6. In src, run python runserver.py to start the server. If no model pikl is found, a model will be automatically built and saved. Enter a port number to select what port the server will run on. Answer yes/no to whether or not the website should be opened in a browser window. There are no entry points defined for our application, and the server must be launched in this manner otherwise nothing will work.
