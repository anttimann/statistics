'use strict';
const pkg = require('../../package.json');

module.exports = [
    {
        method: 'GET',
        path: '/',
        config: {
            handler: (request, reply) => {
                reply.view('templates/index', {
                    g_page_name: pkg.name,
                    g_page_description: pkg.description,
                    g_development_env: !process.env.OPENSHIFT_NODEJS_PORT
                })
            }
        }
    }, {
        method: 'GET',
        path: '/public/{file*}',
        config: {
            handler: {
                directory: {
                    path: './public'
                }
            }
        }
    }, {
        method: 'GET',
        path: '/partials/{partial*}',
        config: {
            handler: (request, reply) => {
                reply.view('app/' + request.params.partial)
            }
        }
    }, {
        method: 'GET',
        path: '/app/{path*}',
        config: {
            handler: (request, reply) => {
                let path = request.params.path.replace('.html', '');
                reply.view('app/' + path)
            }
        }
    }
];