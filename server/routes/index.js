'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/',
        config: {
            handler: (request, reply) => {
                reply.view('templates/index', {
                    g_page_name: process.env.npm_package_name,
                    g_page_description: process.env.npm_package_description
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
    }
    , {
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