// var path = require('path');
// var express = require('express');
//
// var app = express();
// var port = process.env.PORT || 3000;
//
// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });
//
// app.listen(port, '127.0.0.1', function(err) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log('Listening at ' + port);
// });


var http = require('http');

//Lets define a port we want to listen to
const PORT = process.env.PORT || 3000;

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
