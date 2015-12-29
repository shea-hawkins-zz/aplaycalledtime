var getBabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../database/schema.json');
module.exports = getBabelRelayPlugin(schema.data);
