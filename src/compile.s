_                 = require 'lodash'
fs                = require 'fs'
ts                = require 'typescript'
path              = require 'path'
util              = require 'util'
gts               = require 'gulp-typescript'
TypeScriptSimple  = require 'typescript-simple' .TypeScriptSimple

compilerOptions =
  target: 'es6'
  module: 'commonjs'
  moduleResolution: 'node'
  lib: ['es2015', 'es2016']
  noEmitOnError: true

fileCompilerOptions =
  target: ts.ScriptTarget.ES6
  module: ts.ModuleKind.CommonJS
  moduleResolution: ts.ModuleResolutionKind.NodeJS
  lib: ['ES2015', 'ES2016']
  noEmitOnError: true

tss = new TypeScriptSimple fileCompilerOptions

oldFinish = gts.reporter.defaultReporter!.finish

reporter = ->
  errs = []
  return
    error: (err) -> errs.push err.message
    finish: (results) ->
      if results.emitSkipped
        # Hard fix for when gulp-typescript outputs errors twice
        size = errs.length
        errs.splice size / 2, size / 2

      errs.map -> console.log it
      oldFinish results

module.exports = (stream) ->
  stream.pipe gts compilerOptions, reporter!

module.exports.file = (file) ->
  try
    return tss.compile file.contents.toString!
  catch e
    console.log e.message
