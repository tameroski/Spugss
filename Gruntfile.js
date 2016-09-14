var siteURL = "localhost:8888/spuggs/build";

'use strict';
module.exports = function(grunt) {

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        // watch for changes and trigger sass, uglify and livereload
        watch: {
            sass: {
                files: ['assets/styles/**/*.{scss,sass}','assets/styles/libs/*.css'],
                tasks: ['clean', 'sass', 'autoprefixer', 'cssmin']
            },
            js: {
                files: ['assets/js/**/*.js'],
                tasks: ['uglify']
            },
            pug: {
                files: ['sources/*.{pug,jade}','sources/includes/*.{pug,jade}'],
                tasks: ['pug']
            }
        },

        pug: {
            compile: {
                options: {
                    pretty: true,
                },
                files: [
                {
                  expand: true,
                  cwd: 'sources/',
                  src: ['*.{pug,jade}'],
                  dest: 'build/',
                  ext: '.html',
                }]
            }
        },

        // sass
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    loadPath: require('node-neat').includePaths,
                },
                files: {
                    'assets/styles/build/styles.css': 'assets/styles/styles.scss',
                    'assets/styles/build/ie.css': 'assets/styles/ie.scss',
                }
            }
        },

        // autoprefixer
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 9', 'ios 6', 'android 4'],
                map: true
            },
            files: {
                expand: true,
                flatten: true,
                src: ['assets/styles/build/*.css','assets/styles/libs/*.css'],
                dest: 'assets/styles/build'
            },
        },

        // css minify
        cssmin: {
            options: {
                keepSpecialComments: 1
            },
            minify: {
                files: {
                  'build/styles.css': ['assets/styles/build/*.css', 'assets/styles/build/styles.css'],
                  'build/ie.css': ['assets/styles/build/*.css','assets/styles/build/ie.css'],
                }
            },
        },

        // uglify to concat, minify, and make source maps
        uglify: {
            options: {
                compress: false,
                mangle: false,
                flatten: false,
                expand: true
            },
            build: {
                files: {
                    'build/app.min.js' : [
                        'assets/js/libs/*.js',
                        'assets/js/**/*.js',
                    ]
                }
            },
        },

        // sync with browsers
        browserSync: {
            bsFiles: {
                src : ['build/*.css','build/*.html']
            },
            options: {
                proxy: siteURL,
                watchTask: true,
                server: false,
                browser: "google chrome",
            }
        },

        // Task for cleaning the build dir
        clean: ["assets/styles/build"],

    });

    grunt.registerTask('default', ['sass', 'autoprefixer', 'cssmin', 'uglify', 'pug', 'browserSync', 'watch']);

};

