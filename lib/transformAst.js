(function () {
    let _ = require('lodash');
    let util = require('util');
    let tokens = {};
    let createNode = function (symbol, children, literal) {
        if (!_.isArray(children)) {
            children = [children];
        }
        if (literal == null) {
            literal = _(children).map('literal').join();
        }
        return { symbol, literal, children };
    };
    let hasNode = function (node, symbol) {
        return node.children.map(function (child) {
            return child.symbol;
        }).includes(symbol);
    };
    tokens.FunctionDeclaration = function (node) {
        node.children = visit(node.children);
        let func = node.children[0];
        if (hasNode(func, 'NoReturn')) {
            return node;
        }
        let block = _.last(func.children);
        let lastStatement = _.last(block.children);
        let content = lastStatement && lastStatement.children[0] || null;
        if (!content || ['If', 'Try', 'Return'].includes(content.symbol)) {
            return node;
        }
        lastStatement.children[0] = createNode('Return', content, `return ${content.literal}`);
        return node;
    };
    tokens.ClassMethod = tokens.FunctionDeclaration;
    tokens.ClassMethodDeclaration = function (node) {
        if (node.children[0].literal === 'constructor') {
            let funcElems = node.children[1].children[0].children;
            let body = _.findIndex(funcElems, function (elem) {
                return elem.symbol === 'FunctionBlock';
            });
            funcElems.splice(body, 0, createNode('NoReturn', [], '!'));
        }
        node.children = visit(node.children);
        return node;
    };
    let visit = function (nodes) {
        if (!nodes.length) {
            return [];
        }
        return nodes.map(function (node) {
            if (!node.symbol) {
                return node;
            }
            let token = tokens[node.symbol];
            if (token) {
                return token(node);
            }
            node.children = visit(node.children);
            return node;
        });
    };
    module.exports = function (pair) {
        let ast = pair[1];
        ast.children = visit(ast.children);
        pair[1] = ast;
        return pair;
    };
})();
