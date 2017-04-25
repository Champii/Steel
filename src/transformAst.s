_    = require 'lodash'
util = require 'util'

tokens: any = {}

createNode = (symbol, children, literal) ->
  if !_.isArray children
    children = [children]

  if literal == null
    literal = _(children)
      .map 'literal'
      .join!

  return
    symbol
    literal
    children

hasNode = (node, symbol) ->
  node.children
    .map((child) -> child.symbol)
    .includes symbol

tokens.FunctionDeclaration = (node) ->
  node.children = visit node.children

  func = node.children[0]

  if hasNode func, 'NoReturn'
    return node

  block = _.last func.children
  lastStatement = _.last block.children
  content = lastStatement && lastStatement.children[0] || null

  if !content or ['If', 'Try', 'Return'].includes(content.symbol)
    return node

  lastStatement.children[0] = createNode 'Return', content, `return ${content.literal}`

  node

tokens.ClassMethod = tokens.FunctionDeclaration

tokens.ClassMethodDeclaration = (node) ->

  # console.log util.inspect node, depth: null

  if node.children.0.literal is 'constructor'
    funcElems = node.children.1.children.0.children
    body = _.findIndex funcElems, (elem) -> elem.symbol is 'FunctionBlock'
    funcElems.splice body, 0, createNode 'NoReturn', [], '!'

  # console.log util.inspect node, depth: null
  node.children = visit node.children

  node

visit = (nodes) ->
  if !nodes.length
    return []

  nodes.map (node) ->
    if !node.symbol
      return node

    token = tokens[node.symbol]

    if token
      return token node

    node.children = visit node.children
    node

module.exports = (pair) ->
  ast = pair.1
  # console.log util.inspect ast, depth: null
  ast.children = visit ast.children
  pair.1 = ast
  pair
