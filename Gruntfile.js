module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.loadNpmTasks('grunt-contrib-copy');


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
        },

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

        copy: {
            main: {
                files: [
                    {cwd: 'app', src: 'views/**', dest: 'dist/', expand: true },
                    {cwd: 'app', src: 'templates/**', dest: 'dist/', expand: true },
                    {cwd: 'app', src: 'images/**', dest: 'dist/', expand: true },
                    {cwd: 'app', src: 'fonts/**', dest: 'dist/', expand: true },
                    {cwd: 'app', src: 'styles/**', dest: 'dist/', expand: true },
                    {cwd: 'app/jspm_packages', src:['traceur-runtime.js', 'traceur-runtime.js.map'], dest: 'dist/scripts/', filter: 'isFile', expand: true},
                    {cwd: 'app', src:'index.html', dest: 'dist', filter: 'isFile', expand: true}
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
        'clean:dist',
        'exec:bundle',
        'copy:main',
        'filerev:scripts'
    ]);
};