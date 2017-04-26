(function () {
    let _ = require('lodash');
    let fs = require('fs');
    let ts = require('typescript');
    let tiny = require('tiny-parser');
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
    fs = bluebird.promisifyAll(fs);
    exports.transpileStream = function (stream) {
        stream.on('data', exports.transpile);
        return compile(stream);
    };
    exports.transpile = function (file) {
        let pair = [path.basename(file.path), file.contents];
        let preprocessed = preproc(pair);
        let ast = generateAst(preprocessed);
        inspect(ast);
        let transformedAst = transformAst(ast);
        let transpiled = transpile(transformedAst);
        console.log(transpiled[1]);
        transpiled[1] = `(function () {${transpiled[1]}})();`;
        file.contents = new Buffer(transpiled[1]);
        file.path = path.resolve(path.dirname(file.path), path.basename(file.path, '.s') + '.ts');
        return file;
    };
    exports._transpileStringToTs = function (input) {
        let pair = ['', input];
        let preprocessed = preproc(pair);
        let ast = generateAst(preprocessed);
        let transformedAst = transformAst(ast);
        let transpiled = transpile(transformedAst);
        return Promise.resolve(transpiled[1]);
    };
    hook.hook('.s', function (input, file) {
        let trans = exports.transpile(new Vinyl({ path: file, contents: new Buffer(input) }));
        return compile.file(trans);
    });
})();
