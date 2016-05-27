module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: [{
                expand: true,
                cwd: 'client/app',
                src: ['*.scss'],
                dest: 'client/app',
                ext: '.css'
              }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task(s).
  grunt.registerTask('default', ['sass']);

};
