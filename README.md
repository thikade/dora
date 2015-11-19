# DORA: Digital Ocean Remote Admin

A simple AngularJS responive client app that will use your DO v2 API Bearer key
to provide access to several droplet actions:

* create / destroy droplet
* shutdown/boot
* snapshot

It will allow you to manage your droplets from desktop/mobile browser, and show important droplet infos.

Your Digital Ocean Bearer token will be transmitted in DO API calls only!
I.e., sent via https from your browser directly to the DO API endpoint "https://api.digitalocean.com". 
The webserver serving this application will NEVER EVER see your token!

The token will be stored in your browser's local storage. 
Use the setup panel to remove token from locaStorage.


## Files

The Node.js starter application has files as below:

* server.js

	This file contains the server side JavaScript code which simply uses express to
    to server the public directory.

* public/

	This directory contains public resources of the application, that will be
	served up by this server
