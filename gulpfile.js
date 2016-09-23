var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', ['watch']);

gulp.task("browserSync", function() {
  browserSync.init({
    server: true
  });
});

gulp.task("build-css", function() {
  return gulp.src("public/src/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("public/dist"))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task("scripts", function () {
  return gulp.src('public/src/**/*.js')
    .pipe(babel())
		.pipe(rename({suffix: ".min"}))
		.pipe(uglify())
    .pipe(gulp.dest("public/dist"))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task("watch", ["browserSync"], function() {
  gulp.watch("public/src/**/*.scss", ["build-css"]);
  gulp.watch('public/src/**/*.js', ['scripts']);
  gulp.watch("index.html").on('change', browserSync.reload);
  gulp.watch("public/src/**/*.js").on("change", browserSync.reload);
});
