var fnArgs = require('fn-args');
var log = require('./log.js');

function logWarning(fn, arg) {
  var fnName = fn.name || 'function';
  var badFn = log.colors.bold(fnName + '(' + arg + ')');
  var goodFn = log.colors.bold(fnName + '(options, ' + arg + ')');
  log.warn('It looks like you are trying to accept a callback here: ' +
    badFn + '. This is likely to cause problems. You probably want ' +
    goodFn + ' instead.');
}

module.exports = function(fn) {
  var args = fnArgs(fn);
  if (args.length === 1) {
    switch(args[0]) {
      case 'cb':
      case 'callback':
      case 'done':
	logWarning(fn, args[0]);
    }
  }
};
