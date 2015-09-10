'use strict';

var gulp = require('gulp'),
 	sass = require('gulp-sass'),
 	watch = require('gulp-watch'),
 	cssbeautify = require('gulp-cssbeautify');

gulp.task('default', function() {
	return gulp.src('./sass/**/*.scss')
		.pipe(watch('./sass/**/*.scss'))
		.pipe(sass().on('error', sass.logError))
		.pipe(cssbeautify({
			indent: '    ',
			openbrance: 'separate-line',
			autosemicolon: true
		}))
		.pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets/'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});