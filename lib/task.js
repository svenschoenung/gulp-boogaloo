var validateTaskFn = require('./helpers/validateTaskFn.js');

function defTask(gulp, name, fn) {

  validateTaskFn(fn);

  var wrappedTask = function(cb, options) {
    return fn(options, cb);
  };
  var taskName = name || fn.displayName || fn.name;
  wrappedTask.displayName = taskName;

  return gulp.task.apply(gulp, [taskName, wrappedTask]);
}

module.exports = function(gulp, args) {
  if (args.length >= 2) {
    return defTask(gulp, args[0], args[1]);
  }
  return defTask(gulp, null, args[0]);
};

