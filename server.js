var path = require('path');
var express = require('express');
var path = require('path');

app.use(express.static(__dirname + '/semantic'));

app.get('/app', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/app*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(80, 'greatify.me', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://greatify.me:80');
});
