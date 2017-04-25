#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let fs = require('fs.extra');
let argv = require('commander');
let path = require('path');
let gulp = require('gulp');
let steel = require('..');
argv.version('0.0.9').usage('[options] <files ...>').option('-c, --compile', 'Compile files').option('-p, --print', 'Print files').option('-o, --output <folder>', 'File/folder of output').option('-s, --strict', 'Disallow implicite use of <Any> type').option('-t, --typecript', 'Output Typescript instead of Javascript').parse(process.argv);
let paths = argv.args;
let compilePath = '.';
if (argv.compile) {
    if (argv.output) {
        compilePath = argv.output;
    }
    steel.transpileStream(gulp.src(paths)).pipe(gulp.dest(compilePath));
}
else {
    require(path.resolve('./', paths[0]));
}