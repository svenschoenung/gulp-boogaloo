var log = require('./lib/helpers/log.js');

var task = require('./lib/task.js');
var series = require('./lib/series.js');
var parallel = require('./lib/parallel.js');

function requireGulp(gulp) {
  try {
    gulp = gulp || 'gulp';
    if (typeof gulp === 'string') {
      return require(gulp);
    } 
  } catch (e) {
    log.error('Unable to require gulp. Try requiring gulp ' +
      'in your gulpfile.js and passing it as an option: ' + 
      log.colors.bold('require("gulp-boogaloo")({gulp:require("gulp")});'));
    throw e;
  }
  return gulp;
}

module.exports = function(opts) {
  opts = opts || {};
  var gulp = requireGulp(opts.gulp);

  var g = Object.create(gulp);
  g.task = function() {
    return task(gulp, arguments);
  };
  g.series = function() {
    return series(gulp, arguments);
  };
  g.parallel = function() {
    return parallel(gulp, arguments);
  };
  return g;
};
