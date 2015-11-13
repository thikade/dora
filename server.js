//old
/*
var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect();
var serverDir="D:/Apps/nodejs-data/dora/public";

app.use(serveStatic(serverDir) );
app.listen(5000);

*/

// new 
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var port = appEnv.port;

var express = require('express');
var app = express();
var path = require('path');


// send our index.html file to the user for the home page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/do.html'));
});

app.use(express.static('public'));

// start the server
app.listen(port);
console.log( "listening on port " + port);
console.log( "serving from dir: " + __dirname);


