'use strict';

const Promise = require('bluebird');
const MongoDB = Promise.promisifyAll(require('mongodb'));
const MongoClient = MongoDB.MongoClient;

const config = require('./config');

function init(server) {
    let url = config.mongodb_url;
    url += config.mongodb_db;

    MongoClient.connectAsync(url, {uri_decode_auth: true})
        .then(function(db) {
            server.app.database = db;
        });
}

module.exports = {
    init: init
};