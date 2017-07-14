#!/usr/bin/env node
require
  gulp
  path
  lodash: _
  'fs.extra': fs
  commander: argv
  '..': steel

pack    = path.resolve __dirname, '../package.json'
version = require(pack).version

printFileWithLines := string -> void
printFileWithLines = (content) -> content.split '\n' .forEach (v, i) -> console.log `${i}: ${v}`

argv
.version(version)
.usage '[options] <files ...>'
.option '-c, --compile', 'Compile files'
.option '-p, --print', 'Print files'
.option '-l, --lines', 'Print files with lines (must have -p)'
.option '-o, --output <folder>', 'File/folder of output'
.option '-s, --strict', 'Disallow implicit use of <Any> type'
.option '-t, --typescript', 'Output Typescript instead of Javascript (no typechecking)'
.option '-b, --bare', 'Dont wrap into top level anonymous function'
.option '-q, --quiet', 'Dont output types errors/warnings (useful with -p)'
.parse process.argv

paths = argv.args
compilePath = '.'

if not paths.length
  process.exit!

if not argv.compile and not argv.print
  require path.resolve './', paths.0
  return


out = steel.transpileStream gulp.src(paths), argv

if argv.print
  out.on 'data', (file) ->
    console.log file.path + ':'
    if argv.lines
      printFileWithLines file.contents.toString!
    else
      console.log file.contents.toString!

if argv.compile
  if argv.output
    compilePath = argv.output
  out.pipe(gulp.dest compilePath).on 'error', (err) -> process.exit 1
