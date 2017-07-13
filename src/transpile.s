_       = require 'lodash'
ts      = require 'typescript'
util    = require 'util'
path    = require 'path'

tokens: any = {}
variables   = [[]]
types       = {}
hasCurry    = false

currentBlockIndent = 0

hasVariable = (vari) ->
  _.some variables, (scope) -> scope.includes vari

pushScope = -> variables.push []
popScope  = -> variables.pop!
addVariable = (vari) -> variables[variables.length - 1].push vari

tokens.TypeAssignation = (node) ->
  res = transpile node.children

  variable = res.shift()

  types[variable] = res[0]

  ''

tokens.TypeExpression = (node) ->
  transpile node.children

tokens.Statement = (node) ->
  res = transpile node.children

  text = `${res.join('')}`

  if ['Import', 'If', 'Try', 'While', 'For'].includes(node.children[0].symbol)
    return `${text}`

  if !res[0]
    return ''

  if res[0][res[0].length - 2] is ';' and res[0][res[0].length - 1] is '\n'
    return text

  `${text};\n`

applyTypes = (type, node) ->
  if type.length is 1
    return `:${type[0]}`

  funcArgs = node.children[1].children[0].children[0]

  argsNode = []

  if funcArgs.symbol is 'FunctionArguments'
    argsNode = transpile funcArgs.children

  returnType = type.pop()

  if type.length isnt argsNode.length
    throw 'Type declaration mismatch identifier declatation'

  argsTypes = argsNode.map((arg, i) -> `${arg}:${type[i]}`)

  `:(${argsTypes}) => ${returnType}`

tokens.Assignation = (node) ->
  res = transpile node.children
  text = ''

  if !hasVariable(res[0]) and !['ComputedProperty', 'ComputedPropertyDirect'].includes node.children[0].symbol
    text += 'let '
    addVariable res[0]

  if res[2]
    res[0] = `${res[0]}:${res[2]}`
    res.splice 2, 1
  else if types[res[0]]
    res[0] = `${res[0]}${applyTypes(types[res[0]], node)}`

  `${text}${res.join(' = ')}`

tokens.Existance = (node) ->
  res = transpile node.children
  `(${res[0]} != null)`

tokens.ParensAssignable = (node) ->
  res = transpile node.children
  parens = res.shift()
  `(${res.join('')})`

tokens.ParensExpression = (node) ->
  res = transpile node.children
  parens = res.shift()
  `(${parens})${res.join('')}`

tokens.Identifier = (node) ->
  node.literal

tokens.Block = (node) ->
  currentBlockIndent += 2

  res = transpile node.children

  indent = _.repeat ' ', currentBlockIndent

  currentBlockIndent -= 2

  res = res.map((text) -> `${indent}${text}`)

  res.unshift('{\n')
  res.push(`${_.repeat(' ', currentBlockIndent)}}`)

  res.join('')

tokens.FunctionBlock = (node) ->
  currentBlockIndent += 2

  pushScope!

  res = transpile(node.children)

  popScope!

  indent = _.repeat(' ', currentBlockIndent)

  currentBlockIndent -= 2

  res = res.map((text) -> `${indent}${text}`)

  res.push(`${_.repeat(' ', currentBlockIndent)}`)

  res.join('')

tokens.Literal = (node) ->
  node.literal

tokens.FunctionArguments = (node) ->
  returnType = ''

  if node.children.length and node.children[node.children.length - 1].symbol is 'FunctionReturnType'
    returnType = `: ${node.children.pop().literal}`

  res = transpile(node.children)

  res.forEach addVariable

  `(${res.join(', ')})${returnType}`

tokens.FunctionArgument = (node) ->
  res = transpile(node.children)
  arr = []

  res.forEach (arg) ->
    if arg[0] === ':'
      arr[arr.length - 1] = `${arr[arr.length - 1]}${arg}`
    else
      arr.push(arg)

  arr

functionManage = (node) ->
  res = transpile(node.children)

  args = '()'
  if res[0] && res[0][0] === '('
    args = res[0]
    res.shift()

  res = res.map((text) -> `${text}`)
  res.push(`}`)
  res.unshift('{\n')

  [args, res]

tokens.FunctionReturnType = (node) ->
  res = transpile node.children
  res.join('')

tokens.FunctionExpression = (node) ->
  [args, res] = functionManage(node)

  `function ${args} ${res.join('')}`

tokens.ArrowFunction = (node) ->
  [args, res] = functionManage(node)

  `${args} => ${res.join('')}`

tokens.FunctionExpressionCurry = (node) ->
  hasCurry = true

  [args, res] = functionManage(node)

  `curry$(function ${args} ${res.join('')})`

tokens.ArrowFunctionCurry = (node) ->
  hasCurry = true

  [args, res] = functionManage(node)

  `curry$(${args} => ${res.join('')})`

tokens.FunctionCall = (node) ->
  res = transpile(node.children)
  variableName = res.shift()

  `${variableName}${res.join('')}`

tokens.Call = (node) ->
  res = transpile(node.children)

  `(${res.join('')})`

tokens.CallArg = (node) ->
  res = transpile(node.children)

  res.join(', ')

tokens.Object = (node) ->
  res = transpile(node.children)

  `{${res.join(', ')}}`

tokens.ObjectDestruct = (node) ->
  res = transpile(node.children)

  `{${res.join(', ')}}`

tokens.ArrayDestruct = (node) ->
  res = transpile(node.children)

  `[${res.join(', ')}]`

tokens.ObjectProperties = (node) ->
  res = transpile(node.children)

  pairs = _.chunk(res, 2)
  objs = pairs
  .map (pair) ->
    if pair[0][0] is '`'
      pair[0] = `[${pair[0]}]`

    pair
  .map (pair) -> pair.join(': ')

  `${objs.join(', ')}`

tokens.Array = (node) ->
  res = transpile(node.children)

  `[${res.join(', ')}]`

tokens.ArrayProperties = (node) ->
  res = transpile(node.children)

  `${res.join(', ')}`

tokens.ComputedProperty = (node) ->
  res = transpile(node.children)

  res.join('')

tokens.ComputedPropertiesDots = (node) ->
  res = transpile(node.children)

  if node.children[0].symbol is 'NumericComputedProperty'
    return `${res.join('')}`

  `.${res.join('.')}`

tokens.ComputedPropertyDirect = (node) ->
  res = transpile(node.children)

  res.join('.')

tokens.ComputedPropertiesBraces = (node) ->
  res = transpile(node.children)

  `[${res.join('')}]`

tokens.NumericComputedProperty = (node) ->
  res = transpile(node.children)

  `[${node.literal}]`

tokens.BooleanExpr = (node) ->
  res = transpile(node.children)

  res.join(' ')

tokens.BooleanLiteral = (node) ->
  node.literal

tokens.If = (node) ->
  res = transpile(node.children)

  condition = res.shift()

  `if (${condition}) ${res.join('')}\n`

tokens.ElseIf = (node) ->
  res = transpile(node.children)

  condition = res.shift()

  ` else if (${condition}) ${res.join('')}`

tokens.Else = (node) ->
  res = transpile(node.children)

  ` else ${res.join('')}`

tokens.Try = (node) ->
  res = transpile(node.children)

  `try ${res.join('')}\n`

tokens.Catch = (node) ->
  res = transpile(node.children)
  cond = ''
  if res.length is 2
    cond = res.shift()

  ` catch (${cond}) ${res.join('')}`

tokens.While = (node) ->
  res = transpile(node.children)

  condition = res.shift()

  `while (${condition}) ${res.join('')}\n`

tokens.For = (node) ->
  res = transpile(node.children)

  condition = res.shift()

  `for (${condition}) ${res.join('')}\n`

tokens.ForCond = (node) ->
  res = transpile(node.children)

  `${res.join(';')}`

tokens.Test = (node) ->
  res = transpile(node.children)

  `${res.join(' ')}`

tokens.TestOp = (node) ->
  if node.literal is 'is'
    return '==='
  else if node.literal is 'isnt'
    return '!=='
  else if node.literal is 'and'
    return '&&'
  else if node.literal is 'or'
    return '||'

  node.literal

tokens.Unary = (node) ->
  res = transpile(node.children)

  res.join ''

tokens.UnaryOp = (node) ->
  node.literal

tokens.Not = (node) ->
  res = transpile(node.children)

  `!${res.join('')}`

tokens.Operation = (node) ->
  res = transpile(node.children)

  `${res.join(' ')}`

tokens.Operator = (node) ->
  node.literal

tokens.Return = (node) ->
  res = transpile(node.children)

  `return ${res.join(' ')}`

tokens.Throw = (node) ->
  res = transpile(node.children)

  `throw ${res.join(' ')}`

tokens.Class = (node) ->
  res = transpile(node.children)

  if node.children[node.children.length - 1].symbol is 'Extends'
    res.splice 1, 0, res.pop!

  hasBlock = _.map node.children, 'symbol' .includes 'ClassBlock'
  if !hasBlock
    res.push '{}'

  `class ${res.join(' ')}`

tokens.Extends = (node) ->
  res = transpile node.children
  `extends ${res[0]}`

tokens.ClassBlock = (node) ->
  currentBlockIndent += 2

  res = transpile(node.children)

  indent = _.repeat(' ', currentBlockIndent)

  currentBlockIndent -= 2

  res = res.map((text) -> `${indent}${text}`)

  res.unshift('{\n')
  res.push(`${_.repeat(' ', currentBlockIndent)}}`)

  res.join('')

tokens.ClassStatement = (node) ->
  res = transpile(node.children)

  `${res.join('')}\n`

tokens.ClassMethodDeclaration = (node) ->
  res = transpile(node.children)

  `${res.join('')}`

tokens.ClassPropertyDeclaration = (node) ->
  res = transpile(node.children)

  `${res.join(' = ')};`

tokens.ClassMethod = (node) ->
  res = _.compact transpile(node.children[0].children)

  args = '()'
  if res.length > 1
    args = res.shift!

  res.unshift('{\n')
  res.push(`${_.repeat(' ', currentBlockIndent - 2)}}`)

  `${args} ${res.join('')}`

tokens.Interface = (node) ->
  res = transpile(node.children)

  `interface ${res.join(' ')}`

tokens.InterfaceBlock = (node) ->
  currentBlockIndent += 2

  res = transpile(node.children)

  indent = _.repeat(' ', currentBlockIndent)

  currentBlockIndent -= 2

  res = res.map((text) -> `${indent}${text}`)

  res.unshift('{\n')
  res.push(`${_.repeat(' ', currentBlockIndent)}}`)

  res.join('')

tokens.BlockTypeDeclaration = (node) ->
  res = transpile(node.children)

  ex = ''
  if res.length is 3
    ex = '?'

  `${res[0]}${ex}:${res[1]};\n`

tokens.New = (node) ->
  res = transpile(node.children)

  `new ${res.join('')}`

tokens.ChainedCall = (node) ->
  res = transpile(node.children)
  res = _.reduce res, (acc, i) -> `(${i}${acc})`, ''

  res

tokens.This = (node) ->
  'this'

tokens.Import = (node) ->
  res = transpile(node.children)

  `${res.join('')}`

importNativeEs5 = (node) ->
  id = node.children[0].literal
  if node.children.length is 1
    return `import * as ${id} from '${id}';\n`

  fromId = node.children[1]
  if fromId.children[0].symbol is 'Identifier'
    return `import * as ${fromId.children[0].literal} from '${id}';\n`

  return `import ${transpile(fromId.children).join('')} from '${id}';\n`

getStringBaseName = (lit) ->
  val = lit
  if val.0 is '.' and val.1 is '/'
    val = path.basename val, path.extname val
  val

stringImport = (lit) ->
  val = getStringBaseName lit
  return `import ${val} = require('${lit}');\n`

importCommonJs = (node) ->
  id = node.children[0].literal

  if node.children[0].symbol is 'StringLiteral'
    id = id.substr 1, id.length - 2

  if node.children.length is 1 and node.children[0].symbol is 'StringLiteral'
    return stringImport id

  if node.children.length is 1
    return `import ${id} = require('${id}');\n`

  fromId = node.children[1]

  if fromId.children[0].symbol is 'Identifier'
    return `import ${fromId.children[0].literal} = require('${id}');\n`

  if fromId.children[0].symbol is 'ObjectDestruct'
    destruct = transpile(fromId.children).join('')
    res = ''
    tmpId = id

    if node.children[0].symbol is 'StringLiteral'
      tmpId = getStringBaseName tmpId
      res = `import _${tmpId} = require('${id}');\n`
    else
      res = `import _${id} = require('${id}');\n`

    res += `let ${destruct} = _${tmpId};\n`
    return res

  return `import ${transpile(fromId.children).join('')} = require('${id}');\n`

tokens.ImportLine = (node) ->
  forcedVersion = 'common'

  if forcedVersion is 'common'
    return importCommonJs node
  else if forcedVersion is 'native'
    return importNativeEs5 node

curryFunction = `function curry$(f: any, bound?: any){ let context: any, _curry: any = function(args?: any){ return f.length > 1 ? function(){ var params = args ? args.concat() :[]; context = bound ? context || this : this; return params.push.apply(params, arguments) < f.length && arguments.length ? _curry.call(context, params) : f.apply(context, params); } : f; }; return _curry(); }`

addCurryDeclaration = (res) ->
  if hasCurry
    return res + curryFunction

  res

transpile = (nodes) ->
  if !nodes.length
    return []

  nodes.map (node) ->
    token = tokens[node.symbol]
    if !node.symbol
      return node.literal

    if token
      return token node

    transpile(node.children).join('')

extractShebang = (tree) ->
  if tree.children.0.symbol is 'Shebang'
    return tree.children.0.literal

  return null

_transpile = (pair, options) ->
  if not options?
    options = {}

  ast = pair.1
  shebang = extractShebang ast

  variables = [[]]
  types = {}
  hasCurry = false

  pair.1 = addCurryDeclaration transpile(ast.children).join('')

  if not options.bare
    pair.1 = pair.1.split '\n' .map(-> `  ${it}`).join '\n'
    pair.1 = `(function () {\n${pair[1]}\n})();`

  if shebang
    pair.1 = `${shebang}${pair[1]}`

  pair

module.exports = _transpile
