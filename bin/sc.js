/// <reference path="node.d.ts" />
var _ = require('lodash');
var fs = require('fs.extra');
var argv = require('commander');
var path = require('path');
var gulp = require('gulp');
var steel = require('..');
argv.version('0.0.1').usage('[options] <files ...>').option('-c, --compile', 'Compile files').option('-p, --print', 'Print files').option('-o, --output <folder>', 'File/folder of output').option('-s, --strict', 'Disallow implicite use of <Any> type').option('-t, --typecript', 'Output Typescript instead of Javascript').parse(process.argv);
var paths = argv.args;
var compilePath = '.';
if (argv.compile) {
    if (argv.output) {
        compilePath = argv.output;
    }
    steel.transpileStream(gulp.src(paths)).pipe(gulp.dest(compilePath));
}
else {
    require(path.resolve('./', paths[0]));
}
