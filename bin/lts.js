var l = require('lodash');
var fs = require('fs.extra');
var argv = require('commander');
var path = require('path');
var hook = require('node-hook');
var walk = require('walk');
var async = require('async');
var lightscript = require('..');
argv.version('0.0.1'.usage('[options] <files ...>'.option('-c, --compile', 'Compile files'.option('-p, --print', 'Print files'.option('-o, --output <folder>', 'File/folder of output'.option('-s, --strict', 'Disallow implicite use of <Any> type'.option('-t, --typecript', 'Output Typescript instead of Javascript'.parse(process.argv))))))));
var paths = argv.args;
var transpile = function (files) {
    return lightscript.transpileFiles(files)["catch"](function (err) {
        console.log(err);
        return process.exit(1);
    });
};
var compilePath = path.resolve('./');
var walkPath = function (filePath, done) {
    var files = {};
    var fileWalker = function (root, fileStats, next) {
        var resPath = path.resolve(root, fileStats.name);
        var outPath = resPath.replace(resPath, compilePath);
        var ext = path.extname(fileStats.name);
        if (ext === '.li') {
            var files_1 = (fileStats.name = resPath[0], resPath);
            fs.mkdirpSync(root);
        }
        ;
        return next();
    };
    var walker = fs.walk(filePath, {});
    walker.on('file', fileWalker);
    return walker.on('end', function () {
        return done(files);
    });
};
if (argv.compile) {
    if (argv.output) {
        compilePath = path.resolve('./', argv.output);
    }
    ;
    async.map(paths, function (filePath, done) {
        ext = path.extname(filePath);
        if (ext !== '') {
            return (done(null, path.resolve('./', filePath)));
        }
        ;
        return walkPath(filePath, function (res) {
            return done(null, Object.keys(res).map(function (key) {
                return res[key];
            }));
        });
    }, function (err, res) {
        return transpile(l.flatten(res)).then(function (fileArr) {
            return fileArr.map(function (file) {
                resPath = path.resolve(file.dirname, file.filename);
                return fs.writeFileSync(resPath, file.output);
            });
        });
    });
}
else {
    require(path.resolve('./', paths[0]));
}
;
