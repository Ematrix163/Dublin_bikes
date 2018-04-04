**Feb 27th 2018**

Successful first meeting. Began to create a project backlog. etc

Louis mentioned the possibility of working during the holidays. Diarmuid mentioned that he would properly be on holiday for the second week of the holidays and wanted to get everything done before then. Chen failed to mention that he would be on holiday for the first week of the holidays. 

There was some lively discussion about features to include. It was agreed that, at first at least, everyone would work on a little portion of what they wishe. An original product backlog was constructed and it looked like this...

![original trello board](images/trello1.png)

However, it snowed thereafter and there were no face to face meetings until the next Tuesday. Diarmuid made a vague effort to communicate via whatsapp, but the rest of the crew was preoccupied, enjoying the lustre and bon homie, of the winter wonderland into which Dublin City had been temporarily transformed. Whilst his team mates frolicked, Diarmuid sat glumly in his Aunt's kitchen, drinking red wine and trying to remember the login credentials for the mysql database he had created. 

**Tues 3rd March**

Lots of progress had been made. The snow break had been highly productive, and many of the essential features, and even a few of the ideal features had been struck from the project backlog. Issues had, however, been encountered: 

It was determined that html5 geolocator would not function within out a https domain.

The graphs, which were really just red and blue lines drawn on a html canvas element, were ridiculously ugly, and failed to load properly in their marker windows.  In addition, the marker windows wouldn't close when you clicked on a new marker.

Directions were working to UCD, but took about a minute to load and didn't return the nearest bike stand. Instead they would always return a bike stand outside Google's offices in grand canal docks. The teams was never able to ascertain as to why this would take place.

In a drunken haze, the back end had been constructed in such a manner that only Diarmuid could interpret it. It made no use of jinja templates, and instead concantenated all the needed files into an ugly looking string that was then dumped into the user's browser. Whatsmore, the api made no sense. 

All of the api keys were on public display in the git repository. The scraper kept breaking on failing to load a json request, and as a mark of protest at how everyone else in turn failed to notice this, Diarmuid obstinately refused to fix it and in fact only set it running when he wanted to work on the project. 

There were two versions of the front end in operation, and they looked like this -->

![picture](images/s1.png)

![picture2](images/w2.png)

**Thursday 5th March**

Louis failed to show up to the meeting. Chen showed up late. Diarmuid showed up, and discussed the possiblity of using NGINX to obtain a SSL cert with Jake, the team's demonstrator. Chen showed up and didn't seem to care, insisting that it could be done some other way (it later transpired that there was no other way). 

**Holidays**

On Sunday, Diarmuid nervously posted a message in the whatsapp group wondering if anybody had made any progress. There were zero replies. There were no replies, in fact, til the thursday of that week, when Chen revealed he had been in England the whole time, and thus hadn't been in a position to finally commence working on the project. Diarmuid also asked if somebody could maybe, just maybe, fix the webscraper, or at least keep an eye on it to see that it was breaking. There was no answer, and Diarmuid refused to fix it.

On the Tuesday, Diarmuid implemented the charts.js library to display average bike stand occupancy for every hour of a selected day, for a selected stand. He put together a simple dashboard in which the charts could be displayed, and the different stands and days selected.

On Friday night, Diarmuid drunkenly tried to load up the server to show a friend. To his surprise, the webscraper was down again and had scraped no data for approximately three days. In a rage, he fired of a series of polite, yet deeply accusatory whatsapp messages. The implicit accusation was 'idleness'. The response was, again, nothing. The offending messages were redacted/deleted in the morning and thus do not appear in this log.

On the Saturday, Diarmuid went to Scotland and did nothing on the project for the next week. During this time, Chen began working on the project. When Diarmuid returned on the monday, most of his incomprehensible backend code had been dismembered and nothing worked. Except, that was, for Chen's shiny new front end which relied soley upon bike data hardcoded into JSON files, and featured a fancy collapsing side bar with no content in it.

Diarmuid spent the morning salvaging his sickly code baby, which was, on the Tuesday, presented to the demonstrator Jake - in lieu of any actual progress having been made in the preceding two weeks.


