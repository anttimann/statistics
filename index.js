'use strict';

const config  = require('./server/config');

exports.register = (server, options, next) => {
    let plugins = [
        { register: require('vision') },
        { register: require('inert') }
    ];
    
    server.register(plugins, (err) => {
        server.route(require('./server/routes'));

        server.views(config.hapi.views);

        next();
    });
};

exports.register.attributes = {
    pkg: require('./package.json')
};