var _ = require('lodash');
var ts = require('typescript');
var util = require('util');
var tokens = {};
var variables = [[]];
var types = {};
var currentBlockIndent = 0;
var hasVariable = function (variable) {
    return _.some(variables, function (scope) {
        return scope.includes(variable);
    });
};
var pushScope = function () {
    return variables.push([]);
};
var popScope = function () {
    return variables.pop();
};
var addVariable = function (variable) {
    return variables[variables.length - 1].push(variable);
};
tokens.TypeAssignation = function (node) {
    var res = transpile(node.children);
    variable = res.shift();
    types[variable] = res[0];
    return '';
};
tokens.TypeExpression = function (node) {
    return transpile(node.children);
};
tokens.Statement = function (node) {
    var res = transpile(node.children);
    var text = "" + res.join('');
    if (['If', 'Try', 'While', 'For'].includes(node.children[0].symbol)) {
        return "" + text;
    }
    if (!res[0]) {
        return '';
    }
    if (res[0][res[0].length - 2] === ';' && res[0][res[0].length - 1] === '\n') {
        return text;
    }
    return text + ";\n";
};
var applyTypes = function (type, node) {
    if (type.length === 1) {
        return ":" + type[0];
    }
    var argsNode = transpile(node.children[1].children[0].children[0].children);
    var returnType = type.pop();
    var argsTypes = argsNode.map(function (arg, i) {
        return arg + ":" + type[i];
    });
    return ":(" + argsTypes + ") => " + returnType;
};
tokens.Assignation = function (node) {
    var res = transpile(node.children);
    var text = '';
    if (!hasVariable(res[0]) && node.children[0].symbol !== 'ComputedProperties') {
        text += 'let ';
        addVariable(res[0]);
    }
    if (res[2]) {
        res[0] = res[0] + ":" + res[2];
        res.splice(2, 1);
    }
    else if (types[res[0]]) {
        res[0] = "" + res[0] + applyTypes(types[res[0]], node);
    }
    return "" + text + res.join(' = ');
};
tokens.ParensAssignable = function (node) {
    var res = transpile(node.children);
    var parens = res.shift();
    return "(" + res.join('') + ")";
};
tokens.ParensExpression = function (node) {
    var res = transpile(node.children);
    var parens = res.shift();
    return "(" + parens + ")" + res.join('');
};
tokens.Identifier = function (node) {
    return node.literal;
};
tokens.Block = function (node) {
    currentBlockIndent += 2;
    var res = transpile(node.children);
    var indent = _.repeat(' ', currentBlockIndent);
    currentBlockIndent -= 2;
    res = res.map(function (text) {
        return "" + indent + text;
    });
    res.unshift('{\n');
    res.push(_.repeat(' ', currentBlockIndent) + "}");
    return res.join('');
};
tokens.FunctionBlock = function (node) {
    currentBlockIndent += 2;
    pushScope();
    var res = transpile(node.children);
    popScope();
    var indent = _.repeat(' ', currentBlockIndent);
    currentBlockIndent -= 2;
    res = res.map(function (text) {
        return "" + indent + text;
    });
    res.push("" + _.repeat(' ', currentBlockIndent));
    return res.join('');
};
tokens.Literal = function (node) {
    return node.literal;
};
tokens.FunctionArguments = function (node) {
    var res = transpile(node.children);
    res.forEach(addVariable);
    return "(" + res.join(', ') + ")";
};
tokens.FunctionArgument = function (node) {
    var res = transpile(node.children);
    var arr = [];
    res.forEach(function (arg) {
        if (arg[0] === ':') {
            arr[arr.length - 1] = "" + arr[arr.length - 1] + arg;
        }
        else {
            arr.push(arg);
        }
    });
    return arr;
};
var functionManage = function (node) {
    var res = transpile(node.children);
    var args = '()';
    if (res[0] && res[0][0] === '(') {
        args = res[0];
        res.shift();
    }
    res = res.map(function (text) {
        return "" + text;
    });
    res.push("}");
    res.unshift('{\n');
    return [args, res];
};
tokens.FunctionExpression = function (node) {
    var _a = functionManage(node), args = _a[0], res = _a[1];
    return "function " + args + " " + res.join('');
};
tokens.ArrowFunction = function (node) {
    var _a = functionManage(node), args = _a[0], res = _a[1];
    return args + " => " + res.join('');
};
tokens.FunctionCall = function (node) {
    var res = transpile(node.children);
    var variableName = res.shift();
    return "" + variableName + res.join('');
};
tokens.Call = function (node) {
    var res = transpile(node.children);
    return "(" + res.join('') + ")";
};
tokens.CallArg = function (node) {
    var res = transpile(node.children);
    return res.join(', ');
};
tokens.Object = function (node) {
    var res = transpile(node.children);
    return "{" + res.join(', ') + "}";
};
tokens.ObjectDestruct = function (node) {
    var res = transpile(node.children);
    return "{" + res.join(', ') + "}";
};
tokens.ArrayDestruct = function (node) {
    var res = transpile(node.children);
    return "[" + res.join(', ') + "]";
};
tokens.ObjectProperties = function (node) {
    var res = transpile(node.children);
    var pairs = _.chunk(res, 2);
    var objs = pairs.map(function (pair) {
        if (pair[0][0] === '`') {
            pair[0] = "[" + pair[0] + "]";
        }
        return pair;
    }).map(function (pair) {
        return pair.join(': ');
    });
    return "" + objs.join(', ');
};
tokens.Array = function (node) {
    var res = transpile(node.children);
    return "[" + res.join(', ') + "]";
};
tokens.ArrayProperties = function (node) {
    var res = transpile(node.children);
    return "" + res.join(', ');
};
tokens.ComputedProperties = function (node) {
    var res = transpile(node.children);
    return res.join('');
};
tokens.ComputedProperty = function (node) {
    var res = transpile(node.children);
    return res.join('');
};
tokens.ComputedPropertiesDots = function (node) {
    var res = transpile(node.children);
    if (node.children[0].symbol === 'NumericComputedProperty') {
        return "" + res.join('');
    }
    return "." + res.join('.');
};
tokens.ComputedPropertiesBraces = function (node) {
    var res = transpile(node.children);
    return "[" + res.join('') + "]";
};
tokens.NumericComputedProperty = function (node) {
    var res = transpile(node.children);
    return "[" + node.literal + "]";
};
tokens.BooleanExpr = function (node) {
    var res = transpile(node.children);
    return res.join(' ');
};
tokens.If = function (node) {
    var res = transpile(node.children);
    var condition = res.shift();
    return "if (" + condition + ") " + res.join('') + "\n";
};
tokens.ElseIf = function (node) {
    var res = transpile(node.children);
    var condition = res.shift();
    return "else if (" + condition + ") " + res.join('') + "\n";
};
tokens.Else = function (node) {
    var res = transpile(node.children);
    return " else " + res.join('') + "\n";
};
tokens.Try = function (node) {
    var res = transpile(node.children);
    return "try " + res.join('') + "\n";
};
tokens.Catch = function (node) {
    var res = transpile(node.children);
    var cond = '';
    if (res.length === 2) {
        cond = res.shift();
    }
    return "catch (" + cond + ")" + res.join('') + "\n";
};
tokens.While = function (node) {
    var res = transpile(node.children);
    var condition = res.shift();
    return "while (" + condition + ") " + res.join('') + "\n";
};
tokens.For = function (node) {
    var res = transpile(node.children);
    var condition = res.shift();
    return "for (" + condition + ") " + res.join('') + "\n";
};
tokens.ForCond = function (node) {
    var res = transpile(node.children);
    return "" + res.join(';');
};
tokens.Test = function (node) {
    var res = transpile(node.children);
    return "" + res.join(' ');
};
tokens.TestOp = function (node) {
    if (node.literal === 'is') {
        return '===';
    }
    else if (node.literal === 'isnt') {
        return '!==';
    }
    else if (node.literal === 'and') {
        return '&&';
    }
    else if (node.literal === 'or') {
        return '||';
    }
    return node.literal;
};
tokens.Unary = function (node) {
    return node.literal;
};
tokens.Not = function (node) {
    var res = transpile(node.children);
    return "!" + res.join('');
};
tokens.Operation = function (node) {
    var res = transpile(node.children);
    return "" + res.join(' ');
};
tokens.Operator = function (node) {
    return node.literal;
};
tokens.Return = function (node) {
    var res = transpile(node.children);
    return "return " + res.join(' ');
};
tokens.Throw = function (node) {
    var res = transpile(node.children);
    return "throw " + res.join(' ');
};
tokens.Class = function (node) {
    var res = transpile(node.children);
    return "class " + res.join(' ');
};
tokens.ClassBlock = function (node) {
    currentBlockIndent += 2;
    var res = transpile(node.children);
    var indent = _.repeat(' ', currentBlockIndent);
    currentBlockIndent -= 2;
    res = res.map(function (text) {
        return "" + indent + text;
    });
    res.unshift('{\n');
    res.push(_.repeat(' ', currentBlockIndent) + "}");
    return res.join('');
};
tokens.ClassStatement = function (node) {
    var res = transpile(node.children);
    return res.join('') + "\n";
};
tokens.ClassMethodDeclaration = function (node) {
    var res = transpile(node.children);
    return res.join('') + "\n";
};
tokens.ClassMethod = function (node) {
    var res = transpile(node.children);
    return res.join('') + "\n";
};
var transpile = function (nodes) {
    if (!nodes.length) {
        return [];
    }
    return nodes.map(function (node) {
        var token = tokens[node.symbol];
        if (!node.symbol) {
            return node.literal;
        }
        if (token) {
            return token(node);
        }
        return transpile(node.children).join('');
    });
};
var _transpile = function (ast) {
    variables = [[]];
    types = {};
    return transpile(ast.children).join('');
};
module.exports = _transpile;
