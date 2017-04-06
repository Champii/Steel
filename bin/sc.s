_           = require 'lodash'
fs          = require 'fs.extra'
argv        = require 'commander'
path        = require 'path'
hook        = require 'node-hook'
walk        = require 'walk'
async       = require 'async'
steel       = require '..'

argv
  .version '0.0.1'
  .usage '[options] <files ...>'
  .option '-c, --compile', 'Compile files'
  .option '-p, --print', 'Print files'
  .option '-o, --output <folder>', 'File/folder of output'
  .option '-s, --strict', 'Disallow implicite use of <Any> type'
  .option '-t, --typecript', 'Output Typescript instead of Javascript'
  .parse process.argv

paths = argv.args

transpile = (files) ->
  steel
  .transpileFiles(files)
  .catch (err) ->
    console.log err
    process.exit 1

compilePath = './'

walkPath = (filePath, done) ->
  files = {}

  fileWalker = (root, fileStats, next) ->
    resPath = path.resolve root, fileStats.name
    outPath = resPath.replace filePath, compilePath
    ext = path.extname fileStats.name
    if ext is '.s'
      files[fileStats.name] = resPath
      fs.mkdirpSync path.dirname outPath
    next!

  walker = fs.walk filePath, {}

  walker.on 'file', fileWalker
  walker.on 'end', ->
    done files

if argv.compile
  if argv.output
    compilePath = argv.output

  async.map paths, (filePath, done) ->
    ext = path.extname(filePath)

    if ext isnt ''
      return done null, path.resolve './', filePath

    walkPath filePath, (res) ->
      done null, _.values res

  , (err, res) ->
    transpile(_.flatten res)
    .then (fileArr) ->
      fileArr.map (file) ->
        resPath = path.resolve compilePath, file.filename
        fs.writeFileSync resPath, file.output

else
  require path.resolve './', paths[0]
