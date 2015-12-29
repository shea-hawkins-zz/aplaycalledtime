require("babel-register")({
  presets: ['es2015']
});
var koa = require('koa');
var send = require('koa-send');
var serve = require('koa-static');
var route = require('koa-route');
var graphqlHTTP = require('koa-graphql');
var mount = require('koa-mount');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

var schema = require('./database/schema');

var app = koa();
var compiler = webpack(config);

var port = process.env.PORT || 3000;

//Hot middleware
app.use(require('koa-webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('koa-webpack-hot-middleware')(compiler));

//graphql middleware
app.use(
  mount('/graphql', graphqlHTTP({ schema: schema, graphiql: true }))
);

//application middleware
app.use(
  route.get('/dist*', function * () {
    yield send(this, this.path, { root: __dirname });
  })
);

app.use(
  route.get('*', function * () {
    yield send(this, 'index.html');
  })
);

app.listen(port);
console.log("listening on " + port);
