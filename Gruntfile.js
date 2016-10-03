/**
 * Created by dyorex on 2016-10-03.
 */
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        mochaTest: {
            spec: {
                options: {
                    reporter: 'spec',
                    timeout: 10000
                },
                src: ['./test.js']
            }
        }
    });

    grunt.registerTask('default', ['npm-install', 'mochaTest']);
};