module.exports = [
    {
        method: 'GET',
        path: '/',
        config: {
            handler: (request, reply) => {
                reply.view('index', {
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
                reply.view(request.params.partial)
            }
        }
    }
];