_          = require 'lodash'
fs         = require 'fs'
util       = require 'util'
path       = require 'path'
pegjs      = require 'pegjs'

grammar    = fs.readFileSync(path.resolve(__dirname, './light.pegjs')).toString()

parser     = pegjs.generate grammar, cache: true
whitespace = ' '

transpile = (filename, input) ->
  try
    return parser.parse input
  catch e
    if e.location != null
      locationLength = e.location.end.offset - e.location.start.offset
      location = input.substr(_.max([e.location.start.offset - 10, 0]), _.min([locationLength + 20, input.length]))

      console.log `${filename}: ${e.name}: Line ${e.location.start.line} / Col ${e.location.start.column}`
      console.log location
      console.log `${whitespace.repeat(e.location.start.offset - _.max([e.location.start.offset - 10, 0]))}^`

      throw e

    throw e

module.exports = transpile