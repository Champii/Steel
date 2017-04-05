var _ = require('lodash');
var ts = require('typescript');
var util = require('util');
var tokens = {};
var variables = [];
var types = {};
var currentBlockIndent = 0;
tokens.TypeAssignation = function (node) {
    var res = transpile(node.children);
    var variable = res.shift();
    types[variable] = res[0];
    return '';
};
tokens.TypeExpression = function (node) {
    return transpile(node.children);
};
tokens.Statement = function (node) {
    res = transpile(node.children);
    var text = "" + res.join('');
    if (['If', 'Try'].includes(node.children[0].symbol)) {
        return "" + text;
    }
    if (!res[0]) {
        return '';
    }
    if (res[0][res[0].length - 2] === '' && res[0][res[0].length - 1] === '\n') {
        return text;
    }
    return text + "\n";
};
var applyTypes = function (type, node) {
    if (type.length === 1) {
        return ":" + type[0];
    }
    var argsNode = transpile(node.findSymbol('FunctionArgument').children[0].children)[0];
    var returnType = type.pop();
    var argsTypes = argsNode.map(function (arg, i) {
        return arg + ":" + type[i];
    });
    return ":(" + argsTypes + ") => " + returnType;
};
tokens.Assignation = function (node) {
    res = transpile(node.children);
    text = '';
    if (!variables.includes(res[0] && node.children[0].symbol !== 'ComputedProperties')) {
        text += '';
        variables.push(res[0]);
    }
    if (res[1][0] === ':') {
        res[0] = "" + res[0] + res[1];
        res.splice(1, 1);
    }
    else if (types[res[0]]) {
        res[0] = "" + res[0] + applyTypes(types[res[0]], node);
    }
    return "" + text + res.join(' = ');
};
tokens.ParensAssignable = function (node) {
    res = transpile(node.children);
    var parens = res.shift();
    return "(" + res.join('') + ")";
};
tokens.ParensExpression = function (node) {
    res = transpile(node.children);
    parens = res.shift();
    return "(" + parens + ")" + res.join('');
};
tokens.Identifier = function (node) {
    return node.literal;
};
tokens.Block = function (node) {
    currentBlockIndent += 2;
    res = transpile(node.children);
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
    res = transpile(node.children);
    indent = _.repeat(' ', currentBlockIndent);
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
    res = transpile(node.children);
    return "(" + res.join(', ') + ")";
};
tokens.FunctionArgument = function (node) {
    res = transpile(node.children);
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
    res = transpile(node.children);
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
    _a = functionManage(node), args = _a[0], res = _a[1];
    return args + " => " + res.join('');
    var _a;
};
tokens.FunctionCall = function (node) {
    res = transpile(node.children);
    var variableName = res.shift();
    return "" + variableName + res.join('');
};
tokens.Call = function (node) {
    res = transpile(node.children);
    return "(" + res.join('') + ")";
};
tokens.CallArg = function (node) {
    res = transpile(node.children);
    return res.join(', ');
};
tokens.Object = function (node) {
    res = transpile(node.children);
    return "{" + res.join(', ') + "}";
};
tokens.ObjectDestruct = function (node) {
    res = transpile(node.children);
    return "{" + res.join(', ') + "}";
};
tokens.ArrayDestruct = function (node) {
    res = transpile(node.children);
    return "[" + res.join(', ') + "]";
};
tokens.ObjectProperties = function (node) {
    res = transpile(node.children);
    var pairs = _.chunk(res, 2);
    var objs = pairs.map(function (pair) {
        return pair.join(': ');
    });
    return "" + objs.join(', ');
};
tokens.Array = function (node) {
    res = transpile(node.children);
    return "[" + res.join(', ') + "]";
};
tokens.ArrayProperties = function (node) {
    res = transpile(node.children);
    return "" + res.join(', ');
};
tokens.ComputedProperties = function (node) {
    res = transpile(node.children);
    return res.join('');
};
tokens.ComputedProperty = function (node) {
    res = transpile(node.children);
    return res.join('');
};
tokens.ComputedPropertiesDots = function (node) {
    res = transpile(node.children);
    if (node.children[0].symbol === 'NumericComputedProperty') {
        return "" + res.join('');
    }
    return "." + res.join('.');
};
tokens.ComputedPropertiesBraces = function (node) {
    res = transpile(node.children);
    return "[" + res.join('') + "]";
};
tokens.NumericComputedProperty = function (node) {
    res = transpile(node.children);
    return "[" + node.literal + "]";
};
tokens.BooleanExpr = function (node) {
    res = transpile(node.children);
    return res.join(' ');
};
tokens.If = function (node) {
    res = transpile(node.children);
    var condition = res.shift();
    return "if (" + condition + ") " + res.join('') + "\n";
};
tokens.ElseIf = function (node) {
    res = transpile(node.children);
    condition = res.shift();
    return "else if (" + condition + ") " + res.join('') + "\n";
};
tokens.Else = function (node) {
    res = transpile(node.children);
    return " else " + res.join('') + "\n";
};
tokens.Try = function (node) {
    res = transpile(node.children);
    return "try " + res.join('') + "\n";
};
tokens.Catch = function (node) {
    res = transpile(node.children);
    var cond = '';
    if (res.length === 2) {
        cond = res.shift();
    }
    return "catch (" + cond + ")" + res.join('') + "\n";
};
tokens.While = function (node) {
    res = transpile(node.children);
    condition = res.shift();
    return "while (" + condition + ") " + res.join('') + "\n";
};
tokens.For = function (node) {
    res = transpile(node.children);
    console.log(res);
    condition = res.shift();
    return "for (" + condition + ") " + res.join('') + "\n";
};
tokens.ForCond = function (node) {
    res = transpile(node.children);
    console.log(res);
    return "" + res.join('');
};
tokens.Test = function (node) {
    res = transpile(node.children);
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
    res = transpile(node.children);
    return "!" + res.join('');
};
tokens.Operation = function (node) {
    res = transpile(node.children);
    return "" + res.join(' ');
};
tokens.Operator = function (node) {
    return node.literal;
};
tokens.Return = function (node) {
    res = transpile(node.children);
    return "return " + res.join(' ');
};
tokens.Throw = function (node) {
    res = transpile(node.children);
    return "throw " + res.join(' ');
};
tokens.Class = function (node) {
    res = transpile(node.children);
    return "class " + res.join(' ');
};
tokens.ClassBlock = function (node) {
    currentBlockIndent += 2;
    res = transpile(node.children);
    indent = _.repeat(' ', currentBlockIndent);
    currentBlockIndent -= 2;
    res = res.map(function (text) {
        return "" + indent + text;
    });
    res.unshift('{\n');
    res.push(_.repeat(' ', currentBlockIndent) + "}");
    return res.join('');
};
tokens.ClassStatement = function (node) {
    res = transpile(node.children);
    return res.join('') + "\n";
};
tokens.ClassMethodDeclaration = function (node) {
    res = transpile(node.children);
    return res.join('') + "\n";
};
tokens.ClassMethod = function (node) {
    res = transpile(node.children);
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
    variables = [];
    types = {};
    return transpile(ast.children).join('');
};
module.exports = _transpile;
