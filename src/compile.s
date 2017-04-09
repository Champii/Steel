_    = require 'lodash'
fs   = require 'fs'
path = require 'path'
ts   = require 'typescript'

libSource = fs.readFileSync(path.join(path.dirname(require.resolve('typescript')), 'lib.d.ts')).toString!
es2015Source = fs.readFileSync(path.join(path.dirname(require.resolve('typescript')), 'lib.es2015.d.ts')).toString!
es7Source = fs.readFileSync(path.join(path.dirname(require.resolve('typescript')), 'lib.es2016.d.ts')).toString!
nodeSource = fs.readFileSync(path.resolve '.', './typings/globals/node/index.d.ts').toString!

createCompilerHost = (inputs, outputs) ->
  return
    getSourceFile: (filename, languageVersion) ->
      file = inputs[filename]
      if filename.substr(0, 4) is 'lib.'
        file = fs.readFileSync(path.join(path.dirname(require.resolve('typescript')), filename)).toString!

      ts.createSourceFile filename, file, ts.ScriptTarget.ES6, '0'

    writeFile: (name, text, writeByteOrderMark) -> outputs[name] = text
    getDefaultLibFileName: -> 'lib.d.ts'
    useCaseSensitiveFileNames: -> false
    getCanonicalFileName: (filename) -> filename
    getCurrentDirectory: -> ''
    getNewLine: -> '\n'
    fileExists: ->

module.exports = (file) ->
  filename = path.basename file, '.s'
  dirname  = path.dirname file

  return (input) ->
    input = '/// <reference path=\"node.d.ts\" />\n' + input

    filesIn =
      `${filename}.ts`: input
      'lib.d.ts': libSource
      'node.d.ts': nodeSource
      'ES2015.ts': es2015Source
      'ES2016.ts': es7Source
    filesOut = {}

    compilerHost = createCompilerHost filesIn, filesOut
    program = ts.createProgram [`${filename}.ts`], { target: ts.ScriptTarget.ES6, module: ts.ModuleKind.CommonJS, lib: ['ES2015', 'ES2016'] }, compilerHost

    emitResult = program.emit!

    allDiagnostics = ts.getPreEmitDiagnostics program .concat emitResult.diagnostics

    errs = allDiagnostics.map (diagnostic) ->
      { line, character } = diagnostic.file.getLineAndCharacterOfPosition diagnostic.start
      message = ts.flattenDiagnosticMessageText diagnostic.messageText, '\n'
      `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`

    exitCode = 0
    if emitResult.emitSkipped
      exitCode = 1

    errs = _.compact errs

    if errs.length or exitCode
      return Promise.reject errs.join '\n'

    return
      filename: `${filename}.js`
      dirname
      output: filesOut[`${filename}.js`]
