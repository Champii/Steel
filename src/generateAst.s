require
  fs
  util
  path
  pegjs
  lodash: _

grammar    = ''

whitespace = ' '

loadGrammar = ->
  main    = fs.readFileSync path.resolve(__dirname, '../gram/steel.pegjs') .toString!
  folder  = fs.readdirSync path.resolve(__dirname, '../gram/elems')
  files   = folder.map (file) -> fs.readFileSync(path.resolve(__dirname, `../gram/elems/${file}`)).toString! + '\n'
  grammar = _.reduce files, (acc, item) -> `${acc}${item}`, main

loadGrammar!

parser = pegjs.generate grammar, cache: true

transpile = (pair) ->
  try
    pair.1 = parser.parse pair.1
    return pair
  catch e
    if e.location != null
      locationLength = e.location.end.offset - e.location.start.offset
      location = pair.1.substr(_.max([e.location.start.offset - 10, 0]), _.min([locationLength + 20, pair.1.length]))

      console.log `${pair[0]}: ${e.name}: Line ${e.location.start.line} / Col ${e.location.start.column}`
      console.log location
      console.log `${whitespace.repeat(e.location.start.offset - _.max([e.location.start.offset - 10, 0]))}^`

      throw e

    throw e

module.exports = transpile
