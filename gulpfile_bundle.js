/// <binding ProjectOpened='copy-dependencies' />
var gulp = require("gulp");
var gulp_util = require("gulp-util");
var vinyl_source_stream = require("vinyl-source-stream");
var vinyl_buffer = require("vinyl-buffer");
var browserify = require("browserify");
var uglify = require("gulp-uglify");
var gulp_concat = require("gulp-concat");
var gulp_clean_css = require("gulp-clean-css");
var fs = require("fs");
var factor = require("factor-bundle");

// normal workflow: copy-dependencies, concat-libraries, bundle-js-prod

var paths = {
    wwwroot: "."
};
paths.libDest = paths.wwwroot + "/lib";
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

// use this to create a bundle of third party libraries
gulp.task("concat-libraries",
    function() {
        gulp.src([
                "./lib/core-js/client/shim.min.js", // required for Angular
                "./lib/zone.js/dist/zone.js" // required for Angular
            ])
            .pipe(gulp_concat("libraries.js"))
            .pipe(uglify())
            .pipe(gulp.dest("./bundles"));
    });

// use this to create an uglified bundle for the application JavaScript, and bundle the libraries and framework
// use after concat-libraries
gulp.task("bundle-js-prod",
    function() {
        var files = ["./app/main.js", "./bundles/imports.js"];
        var b = browserify(files);
        b.plugin(factor, { outputs: ["./bundles/tmp/application.js"] });
        // bundling starting from mainFrame; no need to list the output for the imports since we don"t use it
        b.bundle()
            .pipe(fs.createWriteStream("./bundles/tmp/frameWork.js") // common code
                .on("close",
                    function() {
                        gulp.src(["./bundles/tmp/application.js"])
                            .pipe(uglify())
                            .pipe(gulp.dest("./bundles"));
                        gulp.src(["./bundles/tmp/frameWork.js"])
                            .pipe(uglify()
                                .on("end",
                                    function() {
                                        setTimeout(function() {
                                                // final js bundling
                                                gulp_util.log("finalizing bundle.js!");
                                                gulp.src([
                                                        "./bundles/libraries.js", "./bundles/frameWork.js"
                                                    ])
                                                    .pipe(gulp_concat("bundle.js"))
                                                    .pipe(gulp.dest("./bundles"));
                                            },
                                            2500);
                                    })
                            )
                            .pipe(gulp.dest("./bundles"));
                        gulp_util.log("wait for the: Process terminated with code 0!");
                    })
            );
    });

// use this to create an uglified bundle for the application JavaScript. Only builts and bundles application.js, and not the framework.js because there were no changes to the framework
gulp.task("bundle-app-prod",
    function() {
        var files = ["./app/main.js", "./bundles/imports.js"];
        var b = browserify(files);
        b.plugin(factor, { outputs: ["./bundles/tmp/application.js"] });
        // bundling starting from mainFrame; no need to list the output for the imports since we don"t use it
        b.bundle()
            .pipe(fs.createWriteStream("./bundles/tmp/frameWork.js") // common code
                .on("close",
                    function() {
                        gulp.src(["./bundles/tmp/application.js"])
                            .pipe(uglify())
                            .pipe(gulp.dest("./bundles"));
                        gulp_util.log("wait for the: Process terminated with code 0!");
                    })
            );
    });