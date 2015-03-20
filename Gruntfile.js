module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.initConfig({
        /**
         * renames files based on hashing algorithms and moves them to dist/scripts
         */
        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            scripts: {
                src: 'app/build.js',
                dest: 'dist/scripts'
            },
            css: {
                src: 'dist/styles/app.min.css',
                dest: 'dist/styles'
            }
        },

        /**
         * executes our jspm bundle command
         */
        exec: {
            bundle: {
                command: 'jspm bundle-sfx --minify scripts/main',
                stdout: true
            }
        },

        /**
         * task for linting code
         */
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    'app/scripts/{,*/}*.js'
                ]
            }
        },

        /**
         * clear the production folder to start over the build process
         */
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/{,*/}*',
                        '!dist/.git*'
                    ]
                }]
            }
        },

        /**
         * copy files from development folder to production folder
         * note that css styles are copied from the concat task
         */
        copy: {
            main: {
                files: [
                    {cwd: 'app', src: 'views/**', dest: 'dist/', expand: true },
                    {cwd: 'app', src: 'templates/**', dest: 'dist/', expand: true },
                    {cwd: 'app', src: 'images/**', dest: 'dist/', expand: true },
                    {cwd: 'app', src: 'fonts/**', dest: 'dist/', expand: true },
                    /* {cwd: 'app', src: 'styles/**', dest: 'dist/', expand: true }, */
                    {cwd: 'app/jspm_packages', src:['traceur-runtime.js', 'traceur-runtime.js.map'], dest: 'dist/scripts/', filter: 'isFile', expand: true}
                ]
            },
            indexFile: {
                options: {
                    process: function (content, srcpath) {
                        console.log(grunt.filerev.summary)
                        var stringToReplace; 
                        var js = 
                            '<script src="scripts/traceur-runtime.js"></script>\n' +
                            '<script src="' + grunt.filerev.summary['app/build.js'].replace('dist/', '') + '"></script>\n';
                        var css = 
                            '<link rel="stylesheet" href="styles/vendor.min.css" >\n' +
                            '<link rel="stylesheet" href="' + grunt.filerev.summary['dist/styles/app.min.css'].replace('dist/', '') + '">\n';

                        //replace the script includes with the production ones
                        stringToReplace = /<\!-- build:js\(app\) --\>(.|\n)*?<\!-- endbuild --\>/gi;
                        content = content.replace(stringToReplace, js);

                        //replace css links
                        stringToReplace = /<\!-- build:css\(app\) --\>(.|\n)*?<\!-- endbuild --\>/gi;
                        content = content.replace(stringToReplace, css);
                        return content;
                    }
                },
                files: [
                    {cwd: 'app', src:'index.html', dest: 'dist', filter: 'isFile', expand: true}
                ]
            }
        },

        /**
         * add css vendor prefixed
         */
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/styles',
                    src: '{,*/}*.css',
                    dest: 'dist/styles/'
                }]
            }
        },

        /**
         * minifies each css file and moves it to dist/styles/
         * @type {Object}
         */
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'app/styles/',
                    src: '{,*/}*.css',
                    dest: 'dist/styles',
                    ext: '.min.css',
                    flatten: true
                }]
            }
        },

        /**
         * concatenates all separately minified css files into app.min.css
         */
        concat: {
            dist_css: {
                options: {
                    sourceMap: true,
                    process: function (src, filepath) {
                        return src.replace(/file/gi, filepath);
                    }
                },
                files: {
                    'dist/styles/app.min.css': ['dist/styles/{,*/}*.css']
                }
            },
            dist_vendor_css: {
                files: {
                    'dist/styles/vendor.min.css': [
                        'app/jspm_packages/bower/angular-loading-bar@0.7.1/src/loading-bar.css',
                        'app/jspm_packages/github/twbs/bootstrap@3.3.2/css/bootstrap.css',
                        'app/jspm_packages/bower/angular-motion@0.3.4/dist/angular-motion.min.css',
                        'app/jspm_packages/bower/toastr@2.1.1/toastr.min.css',
                    ]
                }
            }
        },

    }); //end initConfig

    grunt.registerTask('applyRevisions', [
        'filerev:scripts'
    ]);

    grunt.registerTask('bundle', [
        'lintjs',
        'exec:bundle'
    ]);

    grunt.registerTask('lintjs', [
        'jshint:all'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'exec:bundle',
        'copy:main',
        'cssmin',
        'concat:dist_css',
        'concat:dist_vendor_css',
        'autoprefixer:dist',
        'filerev:scripts',
        'filerev:css',
        'copy:indexFile'
    ]);
};