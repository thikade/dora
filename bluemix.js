
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var port = appEnv.port;

var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect();
var serverDir= __dirname + "/public";

console.log( "serving dir: " + serverDir );
console.log( "listening on port " + port );


app.use(serveStatic(serverDir) );
app.listen(port);