_       = require 'lodash'
ts      = require 'typescript'
util    = require 'util'

tokens    = {}
variables = [[]]
types     = {}

currentBlockIndent = 0

hasVariable = (variable) ->
  _.some variables, (scope) -> scope.includes variable

pushScope = -> variables.push []
popScope  = -> variables.pop!
addVariable = (variable) -> variables[variables.length - 1].push variable

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

  if ['If', 'Try', 'While', 'For'].includes(node.children[0].symbol)
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

  if !hasVariable(res[0]) and node.children[0].symbol isnt 'ComputedProperties'
    text += 'let '
    addVariable res[0]

  if res[2]
    res[0] = `${res[0]}:${res[2]}`
    res.splice 2, 1
  else if types[res[0]]
    res[0] = `${res[0]}${applyTypes(types[res[0]], node)}`

  `${text}${res.join(' = ')}`

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
  res = transpile(node.children)

  res.forEach addVariable

  `(${res.join(', ')})`

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

tokens.FunctionExpression = (node) ->
  [args, res] = functionManage(node)

  `function ${args} ${res.join('')}`

tokens.ArrowFunction = (node) ->
  [args, res] = functionManage(node)

  `${args} => ${res.join('')}`

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

tokens.ComputedProperties = (node) ->
  res = transpile(node.children)

  res.join('')

tokens.ComputedProperty = (node) ->
  res = transpile(node.children)

  res.join('')

tokens.ComputedPropertiesDots = (node) ->
  res = transpile(node.children)

  if node.children[0].symbol is 'NumericComputedProperty'
    return `${res.join('')}`

  `.${res.join('.')}`

tokens.ComputedPropertiesBraces = (node) ->
  res = transpile(node.children)

  `[${res.join('')}]`

tokens.NumericComputedProperty = (node) ->
  res = transpile(node.children)

  `[${node.literal}]`

tokens.BooleanExpr = (node) ->
  res = transpile(node.children)

  res.join(' ')

tokens.If = (node) ->
  res = transpile(node.children)

  condition = res.shift()

  `if (${condition}) ${res.join('')}\n`

tokens.ElseIf = (node) ->
  res = transpile(node.children)

  condition = res.shift()

  `else if (${condition}) ${res.join('')}\n`

tokens.Else = (node) ->
  res = transpile(node.children)

  ` else ${res.join('')}\n`

tokens.Try = (node) ->
  res = transpile(node.children)

  `try ${res.join('')}\n`

tokens.Catch = (node) ->
  res = transpile(node.children)
  cond = ''
  if res.length is 2
    cond = res.shift()

  `catch (${cond})${res.join('')}\n`

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

  `class ${res.join(' ')}`

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

  `${res.join('')}\n`

tokens.ClassMethod = (node) ->
  res = transpile(node.children)

  `${res.join('')}\n`

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

_transpile = (ast) ->
  variables = [[]]
  types = {}

  transpile(ast.children).join('')

module.exports = _transpile
