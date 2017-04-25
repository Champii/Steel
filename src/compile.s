_                 = require 'lodash'
fs                = require 'fs'
ts                = require 'typescript'
path              = require 'path'
gts               = require 'gulp-typescript'
TypeScriptSimple  = require 'typescript-simple' .TypeScriptSimple

compilerOptions =
  target: 'es6'
  module: 'commonjs'
  moduleResolution: 'node'
  sourceMap: false
  emitDecoratorMetadata: false
  experimentalDecorators: false
  removeComments: false
  noImplicitAny: false
  suppressImplicitAnyIndexErrors: true

tss = new TypeScriptSimple compilerOptions

compilerOptions = _.assign {}, { isolatedModules: true }, compilerOptions

module.exports = (stream) ->
  obj = compilerOptions

  stream.pipe gts obj

module.exports.file = (file) ->
  tss.compile file.contents.toString!
