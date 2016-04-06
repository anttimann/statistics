'use strict';

const path = require('path');
const rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    host: process.env.OPENSHIFT_NODEJS_IP || 'localhost',
    port: parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 3000,
    hapi: {
        options: {
        },
        views: {
            engines: {jade: require('jade')},
            path: rootPath + '/templates',
            isCached: false
        }
    }
};
