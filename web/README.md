To launch these sample apps do the following:

* Open a command prompt in this directory
* Run the webserver by typing: npx http-server -p 5003 -c-1
* Run the second webserver by typeing: npx http-server -p 5004 -c-1
* Open a third and fourth command prompt to launch the two OpenFin Apps 
* openfin -l -c http://localhost:5003/config/messagebus.publisher.app.json
* openfin -l -c http://localhost:5004/config/messagebus.listener.app.json
* If the Java app isn't already running then start it up by running the batch script in java\out\artifacts\Java_jar or open the project in intellij and build and run it

* In the publish html app: specify topic: demo-published and JSON Data [{"action":"RESPOND"}] (You can change the action to be other strings and then switch it to ALL to log a time).

* In the subscribe html specify the topic demo-java-response and hit subscribe.
