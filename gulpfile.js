var gulp = require('gulp'),
  spawn = require('child_process').spawn,
  mocha = require('gulp-mocha'),
  jshint = require('gulp-jshint'),
  path = require('path'),
  nicePackage = require('gulp-nice-package'),
  shrinkwrap = require('gulp-shrinkwrap');

require('gulp-help')(gulp);

gulp.task('nice-package', 'Validates package.json', function () {
  return gulp.src('package.json')
    .pipe(nicePackage(null, {
      recommendations: false
    }));
});

gulp.task('shrinkwrap', 'Cleans package.json deps and generates npm-shrinkwrap.json', function () {
  return gulp.src('package.json')
    .pipe(shrinkwrap())
    .pipe(gulp.dest('./'));
});

gulp.task('lint', 'Lint all js', function () {
  return gulp.src(['./*.js', './lib/**/*.js', './test/integ/**/*.js', './test/unit/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', { verbose: true }))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', 'Tests', function () {
  return gulp.src([
    './test/unit/**/*.js',
    './test/integ/**/*.js'
  ])
    .pipe(mocha({reporter: 'dot'}));
});

gulp.task('test-debug', 'Run unit tests in debug mode', function () {
  spawn('node', [
    '--debug-brk',
    path.join(__dirname, 'node_modules/gulp/bin/gulp.js'),
    'test'
  ], { stdio: 'inherit' });
});

gulp.task('watch', 'Watch files and test on change', function () {
  gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['test']);
});

gulp.task('ci', 'Runs all ci validation checks', ['lint', 'test', 'nice-package']);