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

inspect = -> console.log util.inspect it, depth: null
printFileAndLines = (content) -> content.split('\n').forEach((v, i) -> console.log i, v)

fs = bluebird.promisifyAll fs

exports.transpileStream = (stream, options) ->
  stream.on 'data', (data) -> exports.transpile data, options
  compile stream

exports.transpile = (file, options) ->
  pair = [path.basename(file.path), file.contents]

  # console.log pair
  preprocessed   = preproc pair
  ast            = generateAst preprocessed

  # inspect ast

  transformedAst = transformAst ast
  transpiled     = transpile transformedAst, options

  # printFileAndLines transpiled.1

  file.contents = new Buffer transpiled.1
  file.path = path.resolve(path.dirname(file.path), path.basename(file.path, '.s') + '.ts')

  file

exports._transpileStringToTs = (input) ->
  pair = ['', input]
  preprocessed   = preproc pair
  ast            = generateAst preprocessed
  transformedAst = transformAst ast
  transpiled     = transpile transformedAst, bare: true

  Promise.resolve transpiled.1

hook.hook '.s', (input, file) ->
  trans = exports.transpile new Vinyl  path: file, contents: new Buffer input
  compile.file trans
