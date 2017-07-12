(function () {
    let _ = require('lodash');
    let fs = require('fs');
    let ts = require('typescript');
    let hook = require('node-hook');
    let util = require('util');
    let path = require('path');
    let bluebird = require('bluebird');
    let Vinyl = require('vinyl');
    let PassThrough = require('stream').PassThrough;
    let Module = require('module');
    let preproc = require('./preproc');
    let generateAst = require('./generateAst');
    let transformAst = require('./transformAst');
    let transpile = require('./transpile');
    let compile = require('./compile');
    let inspect = function (it) {
        return console.log(util.inspect(it, { depth: null }));
    };
    let printFileAndLines = function (content) {
        return content.split('\n').forEach(function (v, i) {
            return console.log(i, v);
        });
    };
    fs = bluebird.promisifyAll(fs);
    exports.transpileStream = function (stream, options) {
        stream.on('data', function (data) {
            return exports.transpile(data, options);
        });
        return compile(stream);
    };
    exports.transpile = function (file, options) {
        let pair = [path.basename(file.path), file.contents];
        let preprocessed = preproc(pair);
        let ast = generateAst(preprocessed);
        let transformedAst = transformAst(ast);
        let transpiled = transpile(transformedAst, options);
        file.contents = new Buffer(transpiled[1]);
        file.path = path.resolve(path.dirname(file.path), path.basename(file.path, '.s') + '.ts');
        return file;
    };
    exports._transpileStringToTs = function (input) {
        let pair = ['', input];
        let preprocessed = preproc(pair);
        let ast = generateAst(preprocessed);
        let transformedAst = transformAst(ast);
        let transpiled = transpile(transformedAst, { bare: true });
        return Promise.resolve(transpiled[1]);
    };
    hook.hook('.s', function (input, file) {
        let trans = exports.transpile(new Vinyl({ path: file, contents: new Buffer(input) }));
        return compile.file(trans);
    });
})();
