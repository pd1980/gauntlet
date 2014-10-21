The app is tested to work on Chrome and Firefox on Mac and PC.

D3 tree visualization code was referenced from the following:
http://blog.pixelingene.com/2011/07/building-a-tree-diagram-in-d3-js/

==================== #1 ====================
The files enclosed within this project make up a simple web app which use Backbone's View module to initialize and render two custom modules (Control and Display). 

With the architecture provided by this mini web app achieve the following:

1) Set up an event based pub-sub style communication system between the Control and Display modules that allow decoupled interaction between the two modules. As a test of this system achieve the following:
- load the /data/test-data.json file in Control
- pass the parsed json to Display
- output the data using simple html markup that makes sense to you and when done with the rendering tell the Control module that the data has been displayed. 
- once the Control module gets the message that rendering is done, it should console.log('Woohoo, looks like everything is done.')

Despite this being a very simple application your solution should be architected in a manner that would facilitate communication between potentially hundreds of modules.

Deliverables for this project are:
- host the project on github (or similar) and provide the link
- host the actual running application somewhere and provide the link

==================== #2 IS OPTIONAL ====================

2) Utilizing the system set up in #1, load in the /data/data-tree.json file and use the D3 visualization library to display the data using an appropriate diagram style.
