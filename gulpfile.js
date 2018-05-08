var pxtorem = require('gulp-pxtorem');
var gulp = require('gulp');

gulp.task('css',  function() {
    return gulp.src('static/css/postsqlSystem/dynPoint/dynPoint.css')
      .pipe(pxtorem({
        rootValue: 192,
        propList: [
          'width', 'height'
        ]
      }))
      .pipe(gulp.dest('static/css/postsqlSystem/dynPoint/build'));
  });

gulp.task('default', [ 'css']);