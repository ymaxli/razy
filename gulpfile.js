var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var del = require('del');
var path = require('path');
var merge = require('merge2');
var mocha = require('gulp-mocha');
var exec = require('child_process').exec;

var BUILD_DIR = 'dist';
var SRC_DIR = 'src';
var TEST_DIR = 'test';

gulp.task('clean', function(done) {
    del([path.join(BUILD_DIR, '**'), '!' + BUILD_DIR]).then(function() {
        done();
    });
});

gulp.task("compile ts", ['clean'], function () {
    var tsResult = tsProject.src()
        .pipe(tsProject());
    
    return merge([
        tsResult.js.pipe(gulp.dest(BUILD_DIR)),
        tsResult.dts.pipe(gulp.dest(BUILD_DIR))
    ]);
});

gulp.task('default', ['compile ts']);
gulp.task('test', ['compile ts'], function() {
    return gulp.src(path.join(TEST_DIR, 'spec.js'), {read: false})
               .pipe(mocha());
});
gulp.task('cov', [], function(done) {
    exec('istanbul cover node_modules/.bin/_mocha test/spec.js', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        if(err !== null) {
            console.error('code coverage failed!');
            process.exit(1);
        } else {
            done();
            exec('open coverage/lcov-report/index.html');
        }
    });
});