# Welcome to my Neighborhood - MUNICH


## How to run the App
-----------------------------

* If you open the app locally you can run it on a localhost. If you are not familiar with doing that, here are the insructions:

**  You need to install Python. But if you are using Linux or Mac OS X, it should be available on your system already. If you are using Windows, you can get an installer from the Python homepage and follow the instructions to install it:

*Go to www.python.org
*Under the Download section, click the link for Python "3.xxx".
*At the bottom of the page, choose the Windows x86 executable installer and download it.
*When it has downloaded, run it.
*On the first installer page, make sure you check the "Add Python 3.xxx to PATH" checkbox.
*Click Install, then click Close when the installation has finished.
*Open your command prompt (Windows)/terminal (OS X/Linux). To check Python is installed, enter the following command:

** python -V

*This should return a version number. If this is OK, navigate to the directory that your example is inside, using the cd command.

# include the directory name to enter it, for example
**cd Desktop
# use two dots to jump up one directory level if you need to
**cd ..

Then enter the command to start up the server in this directory:

# On Mac and Linux
**python -m SimpleHTTPServer
# On Windows
**python -m http.server

Go back into your browser and type in the URL "localhost:8000"

Then you can use the App...


### The most popular places in Munich are displayed on the map. If you want to get more information....

* click on one of the markers on the Google Map.

### OR
-------

* choose a location out of the list on the left side of the Google Map and click on one.

* You can also use the search function above the Location list. Here you can search a location by name.

The active marker starts bouncing as soon as it's clicked and an infowindow will open with detailed information about the location. 
Additionally you will get Flickr Photos of the location which will give you a better impression.

## Error Handling
------------------

Sometimes there might occure an error. 
If the Map or the Flickr App does not load you will get an alert window with an error message.
