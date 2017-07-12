#!/usr/bin/env node
_           = require 'lodash'
fs          = require 'fs.extra'
argv        = require 'commander'
path        = require 'path'
gulp        = require 'gulp'
steel       = require '..'

pack        = path.resolve __dirname, '../package.json'
version     = require(pack).version

argv
.version(version)
.usage '[options] <files ...>'
.option '-c, --compile', 'Compile files'
.option '-p, --print', 'Print files'
.option '-o, --output <folder>', 'File/folder of output'
.option '-s, --strict', 'Disallow implicite use of <Any> type'
.option '-t, --typecript', 'Output Typescript instead of Javascript'
.option '-b, --bare', 'Dont wrap into top level anonymous function'
.parse process.argv

paths = argv.args
compilePath = '.'

if not paths.length
  process.exit!

if argv.compile
  if argv.output
    compilePath = argv.output

  steel.transpileStream(gulp.src(paths), argv).pipe(gulp.dest compilePath).on('error', (err) -> process.exit 1)

else
  require path.resolve './', paths[0]
