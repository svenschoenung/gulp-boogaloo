/* global describe:false, it:false, beforeEach:false */

var chai = require('chai');
var expect = chai.expect;

chai.use(require('chai-spies'));

var gulp;
var gutil = require('gulp-util');
var log = gutil.log;

function shouldWarn(expected, fn) {
  var warning = false;
  gutil.log = function(msg) {
    if (/Warning:/.test(msg)) {
      warning = true;
    }
  };
  fn();
  expect(warning).to.equal(expected);
}

beforeEach(function(done) {
  delete require.cache[require.resolve('./index.js')];
  delete require.cache[require.resolve('gulp')];
  gulp = require('./index.js')(require('gulp'));
  gutil.log = log;
  done();
});

describe('gulp.task()', function() {
  it('should warn when using callback wrong (cb)', function() {
    shouldWarn(true, function() {
      gulp.task('task', function(cb) { });
    });
  });
  it('should warn when using callback wrong (callback)', function() {
    shouldWarn(true, function() {
      gulp.task('task', function(callback) { });
    });
  });
  it('should warn when using callback wrong (done)', function() {
    shouldWarn(true, function() {
      gulp.task('task', function(done) { });
    });
  });
  it('should not warn when function has no arguments', function() {
    shouldWarn(false, function() {
      gulp.task('task', function() { });
    });
  });
  it('should not warn when function has no callback', function() {
    shouldWarn(false, function() {
      gulp.task('task', function(opts) { });
    });
  });
  it('should not warn when callback is used correctly', function() {
    shouldWarn(false, function() {
      gulp.task('task', function(opts, cb) { });
    });
  });
  it('should use displayName of function as task name', function(done) {
    var called = 0;
    var task = function(options, cb) { called++; cb(); };
    task.displayName = 'taskTest';
    gulp.task(task);
    gulp.series('taskTest')({}, function() {
      expect(called).to.equal(1);
      done();
    });
  });
  it('should use name of function as task name', function(done) {
    var called = 0;
    var task = function taskTest(options, cb) { called++; cb(); };
    gulp.task(task);
    gulp.series('taskTest')({}, function() {
      expect(called).to.equal(1);
      done();
    });
  });

});
describe('gulp.series() and gulp.parallel()', function() {
  it('should run all tasks', function(done) {
    var i = 0;
    var task1 = chai.spy(function(options, cb) {
      expect(i++).to.equal(0);
      expect(options).to.eql({});
      cb();
    });
    var task2 = chai.spy(function(options, cb) {
      expect(i++).to.equal(1);
      expect(options).to.eql({});
      cb();
    });
    var task3 = chai.spy(function(options, cb) {
      expect(i++).to.equal(2);
      expect(options).to.eql({});
      cb();
    });
    gulp.task('task1', task1);
    gulp.task('task2', task2);
    gulp.series('task1', 'task2', task3)({}, function() {
      expect(task1).to.have.been.called();
      expect(task2).to.have.been.called();
      expect(task3).to.have.been.called();
      done();
    });
  });
  it('should pass options to all tasks', function(done) {
    var i = 0;
    var task1 = chai.spy(function(options, cb) {
      expect(i++).to.equal(0);
      expect(options).to.eql({foo:1});
      cb();
    });
    var task2 = chai.spy(function(options, cb) {
      expect(i++).to.equal(1);
      expect(options).to.eql({foo:1});
      cb();
    });
    var task3 = chai.spy(function(options, cb) {
      expect(i++).to.equal(2);
      expect(options).to.eql({foo:1});
      cb();
    });
    gulp.task('task1', task1);
    gulp.task('task2', task2);
    gulp.series('task1', 'task2', task3, {foo:1})({}, function() {
      expect(task1).to.have.been.called();
      expect(task2).to.have.been.called();
      expect(task3).to.have.been.called();
      done();
    });
  });
  it('should merge options when nested', function(done) {
    var i = 0;
    var task1 = chai.spy(function(options, cb) {
      expect(i++).to.equal(0);
      expect(options).to.eql({foo:1, bar:2});
      cb();
    });
    var task2 = chai.spy(function(options, cb) {
      expect(i++).to.equal(1);
      expect(options).to.eql({foo:1, bar:3});
      cb();
    });
    var task3 = chai.spy(function(options, cb) {
      expect(i++).to.equal(2);
      expect(options).to.eql({foo:1, bar:4});
      cb();
    });
    gulp.task('task1', task1);
    gulp.task('task2', task2);
    gulp.series('task1', 
      gulp.parallel('task2', {bar:3}),
      gulp.parallel(task3, {bar:4}),
      {foo:1, bar:2}
    )({}, function() {
      expect(task1).to.have.been.called();
      expect(task2).to.have.been.called();
      expect(task3).to.have.been.called();
      done();
    });
  });
  it('should warn when using callback wrong (cb)', function() {
    shouldWarn(true, function() {
      gulp.parallel(function(cb) { });
    });
  });
  it('should warn when using callback wrong (callback)', function() {
    shouldWarn(true, function() {
      gulp.parallel(function(callback) { });
    });
  });
  it('should warn when using callback wrong (done)', function() {
    shouldWarn(true, function() {
      gulp.parallel(function(done) { });
    });
  });
  it('should not warn when function has no arguments', function() {
    shouldWarn(false, function() {
      gulp.parallel(function() { });
    });
  });
  it('should not warn when function has no callback', function() {
    shouldWarn(false, function() {
      gulp.parallel(function(opts) { });
    });
  });
  it('should not warn when callback is used correctly', function() {
    shouldWarn(false, function() {
      gulp.parallel(function(opts, cb) { });
    });

  });
});
