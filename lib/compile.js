(function () {
    const fs = require('fs');
    const path = require('path');
    const util = require('util');
    const _ = require('lodash');
    const ts = require('typescript');
    const gts = require('gulp-typescript');
    const _typescript_simple = require('typescript-simple');
    let { TypeScriptSimple } = _typescript_simple;
    let compilerOptions = { target: 'es6', module: 'commonjs', moduleResolution: 'node', lib: ['es2015', 'es2016'], noEmitOnError: true, noImplicitAny: false };
    let fileCompilerOptions = { target: ts.ScriptTarget.ES6, module: ts.ModuleKind.CommonJS, moduleResolution: ts.ModuleResolutionKind.NodeJS, lib: ['ES2015', 'ES2016'], noEmitOnError: true };
    let tss = new TypeScriptSimple(fileCompilerOptions);
    let oldFinish = gts.reporter.defaultReporter().finish;
    let reporter = function (options) {
        let errs = [];
        return { error: function (err) {
                return errs.push(err.message);
            }, finish: function (results) {
                if (results.emitSkipped) {
                    let size = errs.length / 2;
                    errs.splice(size, size);
                }
                if (!options.quiet) {
                    errs.map(function (it) {
                        return console.log(it);
                    });
                    return oldFinish(results);
                }
            } };
    };
    module.exports = function (stream, options) {
        compilerOptions.noImplicitAny = !!options.strict;
        return stream.pipe(gts(compilerOptions, reporter(options)));
    };
    module.exports.file = function (file) {
        try {
            return tss.compile(file.contents.toString());
        }
        catch (e) {
            return console.log(e.message);
        }
    };
})();
