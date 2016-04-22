'use strict';

exports.register = (server, options, next) => {
    server.route(require('./routes'));
    next();
};

exports.register.attributes = {
    name: 'pxnet',
    version: '1.0.0'
};