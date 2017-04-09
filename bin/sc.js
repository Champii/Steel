#!/usr/bin/env node
/// <reference path="node.d.ts" />
var _ = require('lodash');
var fs = require('fs.extra');
var argv = require('commander');
var path = require('path');
var hook = require('node-hook');
var walk = require('walk');
var async = require('async');
var steel = require('..');
argv.version('0.0.1').usage('[options] <files ...>').option('-c, --compile', 'Compile files').option('-p, --print', 'Print files').option('-o, --output <folder>', 'File/folder of output').option('-s, --strict', 'Disallow implicite use of <Any> type').option('-t, --typecript', 'Output Typescript instead of Javascript').parse(process.argv);
var paths = argv.args;
var transpile = function (files) {
    return steel.transpileFiles(files)["catch"](function (err) {
        console.log(err);
        return process.exit(1);
    });
};
var compilePath = null;
var walkPath = function (filePath, done) {
    files = {};
    var fileWalker = function (root, fileStats, next) {
        var resPath = path.resolve(root, fileStats.name);
        var outPath = resPath;
        if (compilePath) {
            outPath = resPath.replace(filePath, compilePath);
        }
        var ext = path.extname(fileStats.name);
        if (ext === '.s') {
            files[fileStats.name] = resPath;
            fs.mkdirpSync(path.dirname(outPath));
        }
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
        compilePath = argv.output;
    }
    async.map(paths, function (filePath, done) {
        var ext = path.extname(filePath);
        if (ext === '.s') {
            fs.mkdirpSync(path.dirname(path.resolve(compilePath || '', filePath)));
            return done(null, [path.resolve('./', filePath)]);
        }
        return walkPath(filePath, function (res) {
            return done(null, _.values(res));
        });
    }, function (err, res) {
        return transpile(_.flatten(res)).then(function (fileArr) {
            return fileArr.map(function (file) {
                var resPath = path.resolve(compilePath || '', file.filename);
                return fs.writeFileSync(resPath, file.output);
            });
        });
    });
}
else {
    require(path.resolve('./', paths[0]));
}
