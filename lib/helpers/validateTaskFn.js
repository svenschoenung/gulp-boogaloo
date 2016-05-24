var fnArgs = require('fn-args');
var gutil = require('gulp-util');

function logWarning(fn, arg) {
  var fnName = fn.name || 'function';
  var badFn = gutil.colors.bold(fnName + '(' + arg + ')');
  var goodFn = gutil.colors.bold(fnName + '(options, ' + arg + ')');
  var msg = 
   'Warning: it looks like you are trying to accept a callback here: ' +
   badFn + '. This is likely to cause problems. You probably want ' +
   goodFn + ' instead.';
  gutil.log(gutil.colors.yellow(msg));
}

module.exports = function(fn) {
  var args = fnArgs(fn);
  if (args.length == 1) {
    switch(args[0]) {
      case 'cb':
      case 'callback':
      case 'done':
	logWarning(fn, args[0]);
    }
  }
}
