const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProjectDev = ts.createProject("tsconfig.json", { isolatedModules: true });
const tsProject = ts.createProject("tsconfig.json");
const tsProjectForTests = ts.createProject("tsconfig.json", { isolatedModules: true });
const del = require('del');
const path = require('path');
const merge = require('merge2');
const exec = require('child_process').exec;

const BUILD_DIR = 'dist';
const TEST_BUILD_DIR = 'dist-test';
const SRC_DIR = 'src';
const TEST_DIR = 'test';

gulp.task('clean', function (done) {
    del([path.join(BUILD_DIR, '**'), '!' + BUILD_DIR, path.join(TEST_BUILD_DIR, '**'), '!' + TEST_BUILD_DIR]).then(function () {
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

gulp.task("compile ts dev", ['clean'], function () {
    var tsResult = tsProjectDev.src()
        .pipe(tsProjectDev());

    return merge([
        tsResult.js.pipe(gulp.dest(BUILD_DIR)),
        tsResult.dts.pipe(gulp.dest(BUILD_DIR))
    ]);
});

gulp.task("compile tests in ts", ['compile ts dev'], function () {
    return gulp.src(path.join(TEST_DIR, 'case', 'page-render', '**'))
        .pipe(tsProjectForTests())
        .js
        .pipe(gulp.dest(path.join(TEST_BUILD_DIR, 'case', 'page-render')))
});

gulp.task('default', ['compile ts']);
gulp.task('test', ['compile ts dev', 'compile tests in ts'], function (done) {
    exec('npm test', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        if (err !== null) {
            console.error('test failed!');
            process.exit(1);
        } else {
            done();
        }
    });
});
gulp.task('cov', [], function (done) {
    exec('istanbul cover node_modules/.bin/_mocha test/spec.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        if (err !== null) {
            console.error('code coverage failed!');
            process.exit(1);
        } else {
            done();
            exec('open coverage/lcov-report/index.html');
        }
    });
});