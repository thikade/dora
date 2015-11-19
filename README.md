# DORA: Digital Ocean Remote Admin

A simple responsive AngularJS client web-app that will use your DO v2 API Bearer token
to provide access to several droplet actions:

* create / destroy droplet
* shutdown/boot
* snapshot
* view droplet infos: status, IP, region, size.

It will allow you to manage your droplets from desktop/mobile browser, and show important droplet infos.

You can create new droplets from your own snapshots, 
or you can choose from DO-provided images/application packages

Your Digital Ocean Bearer token will be transmitted in DO API calls only!
I.e., sent via https from your browser directly to the DO API endpoint "https://api.digitalocean.com". 
The webserver serving this application will NEVER EVER see your token!

The token will be stored in your browser's local storage. 
Use the setup panel to remove token from localStorage.


## Files

The Node.js starter application has files as below:

* server.js

	This file contains the server side JavaScript code which simply uses express to
    to server the public directory.

* public/

	This directory contains public resources of the application, that will be
	served up by this server
