(function () {
    let _ = require('lodash');
    let fs = require('fs.extra');
    let argv = require('commander');
    let path = require('path');
    let gulp = require('gulp');
    let steel = require('..');
    let pack = path.resolve(__dirname, '../package.json');
    let version = require(pack).version;
    argv.version(version).usage('[options] <files ...>').option('-c, --compile', 'Compile files').option('-p, --print', 'Print files').option('-o, --output <folder>', 'File/folder of output').option('-s, --strict', 'Disallow implicite use of <Any> type').option('-t, --typecript', 'Output Typescript instead of Javascript').parse(process.argv);
    let paths = argv.args;
    let compilePath = '.';
    if (!paths.length) {
        process.exit();
    }
    if (argv.compile) {
        if (argv.output) {
            compilePath = argv.output;
        }
        steel.transpileStream(gulp.src(paths)).pipe(gulp.dest(compilePath));
    }
    else {
        require(path.resolve('./', paths[0]));
    }
})();
