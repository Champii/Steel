require
  fs: _fs
  util
  path
  vinyl: Vinyl
  lodash: _
  module: Module
  stream: { PassThrough }
  bluebird
  typescript: ts
  'node-hook': hook

  './preproc'
  './generateAst'
  './transformAst'
  './transpile'
  './compile'

inspect = -> console.log util.inspect it, depth: null


fs = bluebird.promisifyAll _fs

interface SteelOptions
  quiet?:      boolean
  bare?:       boolean
  print?:      boolean
  strict?:     boolean
  typescript?: boolean

interface SteelFile
  path: string
  contents: Buffer

exports.transpileStream = (stream: NodeJS.ReadWriteStream, options: SteelOptions): NodeJS.ReadWriteStream ->
  if not options?
    options = {}

  stream.on 'data', (data) -> exports.transpile data, options

  if options.typescript
    return stream

  compile stream, options

exports.transpile = (file: SteelFile, options: SteelOptions): SteelFile ->
  pair = [path.basename(file.path), file.contents]

  # console.log pair
  preprocessed   = preproc pair
  ast            = generateAst preprocessed

  # inspect ast

  transformedAst = transformAst ast
  transpiled     = transpile transformedAst, options

  file.contents = new Buffer transpiled.1
  file.path = path.resolve(path.dirname(file.path), path.basename(file.path, '.s') + '.ts')

  file

exports._transpileStringToTs = (input: string): Promise<string> ->
  pair = ['', input]
  preprocessed   = preproc pair
  ast            = generateAst preprocessed
  transformedAst = transformAst ast
  transpiled     = transpile transformedAst, bare: true

  Promise.resolve transpiled.1

hook.hook '.s', (input: string, file: string) ->
  trans = exports.transpile new Vinyl  path: file, contents: new Buffer input
  compile.file trans
