var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('ljpApp', function(){
    var path = 'resources/assets/js/ljpApp';
    return gulp.src([path + '/app.js', path + '/controllers/*.js', path + '/utils/*.js'])
        .pipe(concat('appv2.js'))
        .pipe(gulp.dest('cdn/js'))
        .pipe(rename('appv2.min.js'))
        .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
        .pipe(gulp.dest('cdn/js'));
});

gulp.task('default', ['ljpApp'] );
