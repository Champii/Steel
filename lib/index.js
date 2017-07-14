(function () {
    const _fs = require('fs');
    const util = require('util');
    const path = require('path');
    const Vinyl = require('vinyl');
    const _ = require('lodash');
    const Module = require('module');
    const _stream = require('stream');
    let { PassThrough } = _stream;
    const bluebird = require('bluebird');
    const ts = require('typescript');
    const hook = require('node-hook');
    const preproc = require('./preproc');
    const generateAst = require('./generateAst');
    const transformAst = require('./transformAst');
    const transpile = require('./transpile');
    const compile = require('./compile');
    let inspect = function (it) {
        return console.log(util.inspect(it, { depth: null }));
    };
    let fs = bluebird.promisifyAll(_fs);
    ;
    ;
    exports.transpileStream = function (stream, options) {
        if (!(options != null)) {
            options = {};
        }
        stream.on('data', function (data) {
            return exports.transpile(data, options);
        });
        if (options.typescript) {
            return stream;
        }
        return compile(stream, options);
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
