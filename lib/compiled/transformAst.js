var _ = require('lodash');
var util = require('util');
var tokens = {};
var createNode = function (symbol, children, literal) {
    if (!_.isArray(children)) {
        var children_1 = [children_1];
    }
    if (literal == null) {
        var literal_1 = _(children).map('literal').join();
    }
    return { symbol: symbol, literal: literal, children: children };
};
var hasNode = function (node, symbol) {
    return node.children.map(function (child) {
        return child.symbol;
    }).includes(symbol);
};
tokens.FunctionDeclaration = function (node) {
    node.children = visit(node.children);
    var func = node.children[0];
    if (hasNode(func, 'NoReturn')) {
        return node;
    }
    var block = _.last(func.children);
    var lastStatement = _.last(block.children);
    var constcontent = lastStatement && lastStatement.children[0] || null;
    if (!content || ['If', 'Try', 'Return'].includes(content.symbol)) {
        return node;
    }
    lastStatement.children[0] = createNode('Return', content, "return " + content.literal);
    return node;
};
var visit = function (nodes) {
    if (!nodes.length) {
        return [];
    }
    return nodes.map(function (node) {
        if (!node.symbol) {
            return node;
        }
        var token = tokens[node.symbol];
        if (token) {
            return token(node);
        }
        node.children = visit(node.children);
        return node;
    });
};
module.exports = function (ast) {
    ast.children = visit(ast.children);
    return ast;
};
