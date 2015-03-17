module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);


    grunt.initConfig({
        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            scripts: {
                src: 'app/build.js',
                dest: 'dist/scripts'
            }
        },

        exec: {
            bundle: {
                command: 'jspm bundle-sfx --minify scripts/main',
                stdout: true
            }
        },

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
        }
    });

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
        'exec:bundle',
        'filerev:scripts'
    ]);
};