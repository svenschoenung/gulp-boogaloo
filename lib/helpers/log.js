var gutil = require('gulp-util');

function log(color, msg) {
  gutil.log('[gulp-boogaloo] ' + gutil.colors[color](msg));
}

module.exports = {
  warn: function(msg) {
    log('yellow', 'Warning: ' + msg);
  },
  error: function(msg) {
    log('red', 'Error: ' + msg);
  },
  colors: gutil.colors
};
