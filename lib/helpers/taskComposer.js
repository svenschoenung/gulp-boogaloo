var extend = require('extend');
var validateTaskFn = require('./validateTaskFn.js');

function wrapFn(fn, options) {
  var wrappedFn = function(cb) {
    return fn(options, cb);
  }; 
  wrappedFn.displayName = fn.displayName || fn.name;
  return wrappedFn;
}

function wrapTask(taskName, options, registry) {
  var taskFn = registry.get(taskName);
  var wrappedTaskFn = function(cb) {
    return taskFn(cb, options);
  }; 
  wrappedTaskFn.displayName = taskName;
  return wrappedTaskFn;
}

function normalize(registry, options) {
  return function(taskNameOrFn) {
    if (typeof taskNameOrFn === 'function') {
      return wrapFn(taskNameOrFn, options);
    }
 
    return wrapTask(taskNameOrFn, options, registry);
  };
}

function getOptions(args) {
  var lastArg = args[args.length - 1];
  if (typeof lastArg !== 'function' &&
      typeof lastArg !== 'string') {
    args.pop();
    return lastArg;
  }
  return {};
}

function validateTaskFns(args) {
  args
    .filter(function(taskNameOrFn) {
      return typeof taskNameOrFn === 'function';
    })
    .forEach(validateTaskFn);
}

module.exports = function(gulp, composition, args) {
  var registry = gulp.registry();
  var compArgs = Array.prototype.slice.call(args);
  var compOptions = getOptions(compArgs);
  validateTaskFns(compArgs);
  return function(options, cb) {
    var mergedOptions = extend({}, options, compOptions);
    var tasks = compArgs.map(normalize(registry, mergedOptions));
    return composition.apply(gulp, tasks)(cb);
  };
};
