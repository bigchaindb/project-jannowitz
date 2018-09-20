require('babel-register');
require('babel-polyfill');

// Source Map Support https://github.com/evanw/node-source-map-support
require('source-map-support').install();

// loads environment variables from a .env file into process.env.
require('dotenv/config');
require('./src');
