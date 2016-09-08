/// <binding ProjectOpened='copy-dependencies, watch-readme' />
var gulp = require("gulp");
var gulp_util = require("gulp-util");
var gulp_to_markdown = require('gulp-to-markdown');
// normal workflow: copy-dependencies

var paths = {
    wwwroot: ""
};
paths.libDest = paths.wwwroot + "./lib";
paths.node_modules = "./node_modules";

gulp.task("copy-dependencies",
    function() {
        gulp.src(paths.node_modules + "/@angular/**/*.js").pipe(gulp.dest(paths.libDest + "/@angular"));
        gulp.src(paths.node_modules + "/systemjs/**/*.js").pipe(gulp.dest(paths.libDest + "/systemjs"));
        gulp.src(paths.node_modules + "/core-js/**/*.js").pipe(gulp.dest(paths.libDest + "/core-js"));
        gulp.src(paths.node_modules + "/zone.js/**/*.js").pipe(gulp.dest(paths.libDest + "/zone.js"));
        gulp.src(paths.node_modules + "/reflect-metadata/**/*.js").pipe(gulp.dest(paths.libDest + "/reflect-metadata"));
        gulp.src(paths.node_modules + "/rxjs/**/*.js").pipe(gulp.dest(paths.libDest + "/rxjs"));
        gulp.src(paths.node_modules + "/angular2-in-memory-web-api/**/*.js")
            .pipe(gulp.dest(paths.libDest + "/angular2-in-memory-web-api"));
    });

gulp.task("watch-readme",
    function () {
        gulp.watch("./wwwroot/readme.html", ["create-readme"]);
    });

gulp.task("create-readme",
    function () {
        return gulp.src("./wwwroot/readme.html")
            .pipe(gulp_to_markdown())
            .pipe(gulp.dest("../"));
    });