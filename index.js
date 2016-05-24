var extend = require('extend');
var util = require('util');

var task = require('./lib/task.js');
var series = require('./lib/series.js');
var parallel = require('./lib/parallel.js');

module.exports = function(gulp, opts) {

  var options = extend({}, {
  }, opts);
 
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
