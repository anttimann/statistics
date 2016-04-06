module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            clientjs: {
                files: [
                    'app/*.js'
                ],
                tasks: ['browserify', 'uglify'],
                options: {
                    spawn: false
                }
            }
        },
        browserify: {
            dist: {
                files: {
                    'public/app.js': ['app/app.js']
                },
                options: {
                    exclude: ['jquery']
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! Grunt Uglify <%= grunt.template.today("yyyy-mm-dd") %> */ '
            },
            build: {
                src: 'public/app.js',
                dest: 'public/app.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch', 'browserify']);

};