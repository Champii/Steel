fs           = require 'fs'
ts           = require 'typescript'
tiny         = require 'tiny-parser'
hook         = require 'node-hook'
util         = require 'util'
path         = require 'path'
bluebird     = require 'bluebird'

preproc      = require './preproc'
generateAst  = require './generateAst'
transformAst = require './transformAst'
transpile    = require './transpile'
compile      = require './compile'

fs = bluebird.promisifyAll fs

exports.transpileFiles = (files) -> bluebird.mapSeries files, exports.transpileFile

exports.transpileFile = (file) ->
  fs
  .readFileAsync(file)
  .then((input) -> exports.transpile input, file)

exports.transpile = (input, file) ->
  preprocessed   = preproc input
  ast            = generateAst file, preprocessed
  transformedAst = transformAst ast
  transpiled     = transpile transformedAst
  console.log transpiled
  compileFunc    = compile file
  compiled       = compileFunc transpiled

  compiled

exports._transpileStringToTs = (input) ->
  preprocessed   = preproc input
  ast            = generateAst '', preprocessed
  transformedAst = transformAst ast
  transpiled     = transpile transformedAst

  Promise.resolve transpiled

hook.hook '.s', (input, file) -> exports.transpile input, file .output
