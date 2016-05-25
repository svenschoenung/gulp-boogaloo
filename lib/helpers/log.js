var gutil = require('gulp-util');

module.exports = {
  warn: function(msg) {
    gutil.log('[gulp-boogaloo] ' + gutil.colors.yellow('Warning: ' + msg));
  },
  error: function(msg) {
    gutil.log('[gulp-boogaloo] ' + gutil.colors.red('Error: ' + msg));
  },
  colors: gutil.colors
};
