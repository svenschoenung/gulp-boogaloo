var taskComposer = require('./helpers/taskComposer.js');

module.exports = function(gulp, args) {
  return taskComposer(gulp, gulp.series, args);
};
