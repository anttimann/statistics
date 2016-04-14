'use strict';

const mongo = require('./mongo');

exports.register = (server, options, next) => {
    mongo.init(server);
    server.route(require('./routes'));
    next();
};

exports.register.attributes = {
    name: 'series',
    version: '1.0.0'
};