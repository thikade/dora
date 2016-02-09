
// useful for CF/Bluemix, wont hurt if run just from local nodejs
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
console.log('Node version: ' + process.version);
console.log( "listening on port " + port);
console.log( "serving from dir: " + __dirname);


