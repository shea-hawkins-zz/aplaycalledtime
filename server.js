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
require("babel-register")({
  presets: ['es2015']
});
var koa = require('koa');
var send = require('koa-send');
var serve = require('koa-static');
var route = require('koa-route');
var graphqlHTTP = require('koa-graphql');
var mount = require('koa-mount');

var schema = require('./data/schema');

var app = koa();

var port = process.env.PORT || 3000;

app.use(function * (next) {
  console.log("Request recieved to " + this.request.url);
  yield * next;
  console.log("Response sending for " + this.request.path);
});

//graphql middleware
app.use(
  mount('/graphql', graphqlHTTP({ schema: schema, graphiql: true }))
);

//application middleware
app.use(
  route.get('/static*', function * () {
    console.log("here");
    yield send(this, this.path, { root: __dirname });
  })
);

app.use(
  route.get('*', function * () {
    console.log("there" + this.request.url);
    yield send(this, 'index.html');
  })
);

app.listen(port);
console.log("listening on " + port);
