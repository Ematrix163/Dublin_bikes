**March 27th 2018**

Met with Jake and discussed the project so far. Reviewed the project backlog from sprint 1. Made a new project backlog for sprint 2.
Louis has dropped out of the team. All else seems to be going well.

Chen is replacing xmhttp requests with ajax queries.

*Screenshots of the current front end -->*

![alt](images/s11.png)
![alt](images/s12.png)
![alt](images/s13.png)
![alt](images/s14.png)
![alt](images/s15.png)

*New project backlog includes -->*

![picture](https://github.com/Ematrix163/Dublin_bikes/blob/master/docs/Dublin%20Bikes%20Sprint%202%20%20%20Trello.png)


**March 28th 2018**

Brief standup meeting. Diarmuid was unable to meet with the lecturer.

Received news that Dublin Bikes has added more bike stands, requiring us to now regularly update the static locations.
http://www.thejournal.ie/dublinbikes-new-stations-3926361-Mar2018/

Chen is changing 'get' requests to 'post' requests and worrying other what content should be placed in the infowindows.

Diarmuid is taking an extended break to wallow and basically do nothing/work on his data analytics homework.



29th march

Chen fixed the problem with marker windows closing, but broke most of Diarmuid's api methods. Diarmuid wrote a gradient function to determine the color of the circles. It is yet to be tested.

Discussed Louis's departure with Jake. Decided to stay as two person team. Discussed keeping better scrum notes.

Chen changed api calls to get static and live data seperately, but it is far too slow. He is going to go roll back to Diarmuid's earlier api call.

Also, the static locations aren't as static as they seem. Seemingly new Dublin bike stands are added all the time. To reflect this, we are going to change the scraper file to scrape static data once a day and update if necessary.


Debated function to scale circles. Settled on radius = math.sqrt(max(abs(available_bikes - available_stands), 1), 2) * 2

Chen is changing all requests to 'post'.

Chen is planning to display the distance from user to all stands in the sidebar.

**Tuesday 3rd**

Had some heavy discussions regarding the best way to collaborate on git and not break each other's code.

We agreeed that before we added any more features to the project, we had to fix and tidy up the ones already included.

During the lecturer's presentation, we learned that we would be expected to include some form of predictive analytics in our project. This did not seem like an easy thing to do within the remaining time frame.

Possibilities include just displaying 'rainy days' and 'not rainy days' side by side. It is unlikely that the group will have proper data to make accurate predictions. They could, however, build a model that would get progressively better as more weather/bike data is scraped.

**Other considerations included:**

Old bikes table needed to be merged with new bikes table. This issue had now been ongoing for a week and a half and no one had committed the time and effort to write the script that would fix it. A 'live' table need to be created, distinguished from the historical data table. On the other hand, the front end was now basically working. 

The api needed to be formalized and agreed upon. The scraper needed to be programmed to update the static locations once a day. The graphs needed someway of reflecting when not enough data was available to draw the given graph. 

The backend really needed to be reformalized in a way that everyone could understand. It had gotten to the point that Diarmuid struggled to understand the backend code that he had written. 

Otherwise, the project looked pretty good. It even looked better than many of the other projects that Diarmuid and Chen saw, despite, of course, being troubled to the core.

**Thursday 5th**
Everyone was on time for the meeting. It was a busy lab, and the project manager did not have an opportunity to speak with the team. Chen had been up all night trying to get nginx to serve our app via gunicorn. Diarmuid was depressed, as other than a fancy search bar and tidier code, no progress had been made in days. However, everything was working again, even if the front end still wasn't returning data from the flask app api.

Chen and Diarmuid spent the entirety of the meeting trying to get Nginx to work. They failed. At the end of the meeting, the lecturer told them not to bother, and they realized that they had wasted a combined ten odd hours of their lives. The focuss now is on adding some form of predictive analytics to the project, though both Chen and Diarmuid have severe doubts as to whether this will actually work with their current data.

As a funny aside, it transpired that Chen had been running the project on his ec2 using it's native ubuntu version of python 2.7. It was a miracle that anything had been working at all, and for this the team felt somewhat blessed.



