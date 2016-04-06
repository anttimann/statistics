const Hapi = require('hapi');
const config = require('./server/config');
const server = new Hapi.Server(config.hapi.options);

server.connection({host: config.host, port: config.port});

const plugins = [
    {
        register: require('good'),
        options: {
            reporters: [
                {
                    reporter: require('good-console'),
                    events: { log: '*', response: '*' }
                }
            ]
        }
    },
    { register: require('./index') }
];

server.register(plugins, (err) => {
    if (err) throw err;
    
    server.start(() => {
        console.log('Hapi server started @' + server.info.uri);
    });
});
