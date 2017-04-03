var _ = require('lodash');
var util = require('util');
var tokens = {};
var createNode = function (symbol, children, literal) {
    if (!_.isArray(children)) {
        var children_1 = [children_1];
    }
    ;
    if (literal == null) {
        var literal_1 = _(children).map('literal'.join());
    }
    ;
    return ;
    return ({ symbol: symbol, literal: literal, children: children });
};
var hasNode = function (node, symbol) {
    return node.children.map(function (child) {
        return child.symbol;
    }).includes(symbol);
};
var tokens, FunctionDeclaration = function (node) {
    var func = node.children[0];
    if (hasNode(func, 'NoReturn')) {
        {
            return , node;
        }
        ;
    }
    ;
    var block = _.last(func.children);
    var lastStatement = _.last(block.children);
    var content = lastStatement.children[0];
    var lastStatement, children = (_a = createNode('Return', content, "return " + content.literal), 0 = _a[0], _a);
    return node;
    var _a;
};
var visit = function (nodes) {
    if (!nodes.length) {
        return ([]);
    }
    ;
    return nodes.map(function (node) {
        if (!node.symbol({ "return": , node: node }))
            ;
        var token = tokens[node.symbol];
        if (token({ "return": , token: token, node: node }))
            ;
        var node, children = visit(node.children);
        return node;
    });
};
var module, exports = function (ast) {
    var ast, children = visit(ast.children);
    return ast;
};
