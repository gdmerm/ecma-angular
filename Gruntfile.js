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
        }
    });

    grunt.registerTask('applyRevisions', [
        'filerev:scripts'
    ]);

    grunt.registerTask('bundle', [
        'exec:bundle'
    ]);

    grunt.registerTask('build', [
        'exec:bundle',
        'filerev:scripts'
    ]);
};