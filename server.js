var path = require('path');
var express = require('express');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/semantic'));

app.get('/app', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '127.0.0.1', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + port);
});
