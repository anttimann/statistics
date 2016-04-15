'use strict';

const path = require('path');
const rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    host: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    port: parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 3000,
    hapi: {
        options: {
        },
        views: {
            engines: {jade: require('jade')},
            path: rootPath,
            isCached: false
        }
    }
};
