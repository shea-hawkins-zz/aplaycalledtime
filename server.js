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
var express = require('express');

var app = express();
var port = process.env.PORT || 3000;

//We need a function which handles requests and send response
// function handleRequest(request, response){
//     response.end('It Works!! Path Hit: ' + request.url);
// }
app.get('*', function(req, res) {
  res.end('It Works!! Path Hit: ' + req.url);
});

//Lets start our server
app.listen(port, 'localhost', function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", port);
});
