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


var koa = require('koa');
var app = koa();

var port = process.env.PORT || 3000;

app.use(function * (next) {
  console.log("Request recieved");
  yield * next;
  console.log("Response sending");
});

app.use(function * (next) {
  this.body = 'Hello World';
  yield * next;
});

app.listen(port);
