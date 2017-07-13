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
    let addReturnRecur = function (block) {
        let lastStatement = _.last(block.children);
        let content = lastStatement && lastStatement.children[0] || null;
        if (!content || ['Return', 'Throw'].includes(content.symbol)) {
            return;
        }
        let blocks = content.children.filter(function (it) {
            return ['Block', 'ElseIf', 'Else', 'Catch'].includes(it.symbol);
        });
        blocks = blocks.map(function (it) {
            if (['ElseIf', 'Else', 'Catch'].includes(it.symbol)) {
                return it.children.find(function (it) {
                    return it.symbol === 'Block';
                });
            }
            return it;
        });
        if (blocks.length) {
            return blocks.forEach(addReturnRecur);
        }
        else {
            return lastStatement.children[0] = createNode('Return', content, `return ${content.literal}`);
        }
    };
    tokens.FunctionDeclaration = function (node) {
        node.children = visit(node.children);
        let func = node.children[0];
        if (hasNode(func, 'NoReturn')) {
            return node;
        }
        let b = _.last(func.children);
        addReturnRecur(b);
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
