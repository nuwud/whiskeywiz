const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'whiskeywiz',
  location: 'us-west1'
};
exports.connectorConfig = connectorConfig;

