"use strict"

const _    = require('lodash');
const util = require('util');

const tokens = {};

const createNode = (symbol, children, literal) => {
  if (!_.isArray(children)) {
    children = [children];
  }

  if (literal == null) {
    literal = _(children)
      .map('literal')
      .join()
    ;
  }

  return {
    symbol,
    literal,
    children,
  };
};

const hasNode = (node, symbol) => {
  return node.children.map(child => child.symbol).includes(symbol);
};

tokens.FunctionDeclaration = (node) => {
  node.children = visit(node.children);

  const func = node.children[0];

  if (hasNode(func, 'NoReturn')) {
    return node;
  }

  const block = _.last(func.children);
  const lastStatement = _.last(block.children);
  const content = lastStatement.children[0];

  lastStatement.children[0] = createNode('Return', content, `return ${content.literal}`);

  return node
};

const visit = (nodes) => {
  if (!nodes.length) {
    return [];
  }

  return nodes
    .map(node => {
      if (!node.symbol) {
        return node;
      }

      const token = tokens[node.symbol];

      if (token) {
        return token(node);
      }

      node.children = visit(node.children);
      return node;
    })
  ;
};

module.exports = (ast) => {
  ast.children = visit(ast.children);
  // console.log(util.inspect(ast, { depth: null }));
  return ast;
};
