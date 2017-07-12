(function () {
    let _ = require('lodash');
    let fs = require('fs');
    let ts = require('typescript');
    let path = require('path');
    let util = require('util');
    let gts = require('gulp-typescript');
    let TypeScriptSimple = require('typescript-simple').TypeScriptSimple;
    let compilerOptions = { target: 'es6', module: 'commonjs', moduleResolution: 'node', lib: ['es2015', 'es2016'], noEmitOnError: true };
    let fileCompilerOptions = { target: ts.ScriptTarget.ES6, module: ts.ModuleKind.CommonJS, moduleResolution: ts.ModuleResolutionKind.NodeJS, lib: ['ES2015', 'ES2016'], noEmitOnError: true };
    let tss = new TypeScriptSimple(fileCompilerOptions);
    let oldFinish = gts.reporter.defaultReporter().finish;
    let reporter = function (it) {
        let errs = [];
        return { error: function (err) {
                return errs.push(err.message);
            }, finish: function (results) {
                if (results.emitSkipped) {
                    let size = errs.length / 2;
                    errs.splice(size, size);
                }
                errs.map(function (it) {
                    return console.log(it);
                });
                return oldFinish(results);
            } };
    };
    module.exports = function (stream) {
        return stream.pipe(gts(compilerOptions, reporter()));
    };
    module.exports.file = function (file) {
        try {
            return tss.compile(file.contents.toString());
        }
        catch (e) {
            console.log(e.message);
        }
    };
})();
