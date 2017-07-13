#!/usr/bin/env node
(function () {
    let _ = require('lodash');
    let fs = require('fs.extra');
    let argv = require('commander');
    let path = require('path');
    let gulp = require('gulp');
    let steel = require('..');
    let pack = path.resolve(__dirname, '../package.json');
    let version = require(pack).version;
    argv.version(version).usage('[options] <files ...>').option('-c, --compile', 'Compile files').option('-p, --print', 'Print files').option('-o, --output <folder>', 'File/folder of output').option('-s, --strict', 'Disallow implicit use of <Any> type').option('-t, --typescript', 'Output Typescript instead of Javascript (no typechecking)').option('-b, --bare', 'Dont wrap into top level anonymous function').option('-q, --quiet', 'Dont output types errors/warnings (useful with -p)').parse(process.argv);
    let paths = argv.args;
    let compilePath = '.';
    if (!paths.length) {
        process.exit();
    }
    if (!argv.compile && !argv.print) {
        require(path.resolve('./', paths[0]));
        return;
    }
    let out = steel.transpileStream(gulp.src(paths), argv);
    if (argv.print) {
        out.on('data', function (file) {
            console.log(file.path + ':');
            return console.log(file.contents.toString());
        });
    }
    if (argv.compile) {
        if (argv.output) {
            compilePath = argv.output;
        }
        out.pipe(gulp.dest(compilePath)).on('error', function (err) {
            return process.exit(1);
        });
    }
})();
