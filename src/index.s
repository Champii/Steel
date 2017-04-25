_            = require 'lodash'
fs           = require 'fs'
ts           = require 'typescript'
tiny         = require 'tiny-parser'
hook         = require 'node-hook'
util         = require 'util'
path         = require 'path'
bluebird     = require 'bluebird'
Vinyl        = require 'vinyl'
PassThrough  = require 'stream' .PassThrough
Module       = require 'module'


preproc      = require './preproc'
generateAst  = require './generateAst'
transformAst = require './transformAst'
transpile    = require './transpile'
compile      = require './compile'

fs = bluebird.promisifyAll fs

exports.transpileStream = (stream) ->
  stream.on 'data', exports.transpile
  compile stream

exports.transpile = (file) ->
  pair = [path.basename(file.path), file.contents]

  preprocessed   = preproc pair
  ast            = generateAst preprocessed
  transformedAst = transformAst ast
  transpiled     = transpile transformedAst

  transpiled.1 = `(function () {\n${transpiled[1]}})();`

  file.contents = new Buffer transpiled.1
  file.path = path.resolve(path.dirname(file.path), path.basename(file.path, '.s') + '.ts')

  file

exports._transpileStringToTs = (input) ->
  pair = ['', input]
  preprocessed   = preproc pair
  ast            = generateAst preprocessed
  transformedAst = transformAst ast
  transpiled     = transpile transformedAst

  Promise.resolve transpiled.1

hook.hook '.s', (input, file) ->
  trans = exports.transpile new Vinyl  path: file, contents: new Buffer input
  compile.file trans
