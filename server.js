var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect();
// var serverDir="../nodejs-data/pro-angularjs/sportsstore";
//var serverDir="D:/Apps/CloudFoundry/projects/binaryshark/public";
var serverDir="D:/Apps/nodejs-data/dora/public";



console.log( "listening on port 5000");
console.log( "serving rom dir: " + serverDir);


app.use(serveStatic(serverDir) );
app.listen(5000);