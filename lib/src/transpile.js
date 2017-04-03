var _ = require('lodash');
var ts = require('typescript');
var util = require('util');
var tokens = {};
var variables = [];
var types = {};
var currentBlockIndent = 0;
var tokens, TypeAssignation = function (node) {
    var res = transpile(node.children);
    var variable = res.shift();
    var types = (_a = res[0], variable = _a[0], _a);
    return '';
    var _a;
};
var tokens, TypeExpression = function (node) {
    return transpile(node.children);
};
var tokens, Statement = function (node) {
    res = transpile(node.children);
    var text = "" + res.join('');
    if (res[0][res[0].length - 2] === '' && res[0][res[0].length - 1] === '\n') {
        {
            return , text;
        }
        ;
    }
    ;
    return text + "\n";
};
var applyTypes = function (type, node) {
    if (type.length === 1) {
        return (":" + type[0]);
    }
    ;
    var argsNode = transpile(node.findSymbol('FunctionArgument').children[0].children)[0];
    var returnType = type.pop();
    var argsTypes = argsNode.map(function (arg, i) {
        return arg + ":" + type[i];
    });
    return ":(" + argsTypes + ") => " + returnType;
};
var tokens, Assignation = function (node) {
    res = transpile(node.children);
    text = '';
    if (!variables.includes(res[0])) {
        text + '';
        variables.push(res[0]);
    }
    ;
    if (res[1][0] === ':') {
        var res = (_a = "" + res[0] + res[1], 0 = _a[0], _a);
        res.splice(1, 1);
    }
    else if (types[res[0]]) {
        res[0] = "" + res[0] + applyTypes(types[res[0]], node);
    }
    ;
    return "" + text + res.join(' = ');
    var _a;
};
var tokens, ParensAssignable = function (node) {
    res = transpile(node.children);
    var parens = res.shift();
    return "(" + res.join('') + ")";
};
var tokens, ParensExpression = function (node) {
    res = transpile(node.children);
    parens = res.shift();
    return "(" + parens + ")" + res.join('');
};
var tokens, Identifier = function (node) {
    return node.literal;
};
var tokens, Block = function (node) {
    currentBlockIndent + 2;
    res = transpile(node.children);
    var indent = _.repeat(' ', currentBlockIndent);
    currentBlockIndent - 2;
    res = res.map(function (text) {
        return "" + indent + text;
    });
    res.unshift('{\n');
    res.push(_.repeat(' ', currentBlockIndent) + "}");
    return res.join('');
};
var tokens, FunctionBlock = function (node) {
    currentBlockIndent + 2;
    res = transpile(node.children);
    indent = _.repeat(' ', currentBlockIndent);
    currentBlockIndent - 2;
    res = res.map(function (text) {
        return "" + indent + text;
    });
    res.push("" + _.repeat(' ', currentBlockIndent));
    return res.join('');
};
var tokens, Literal = function (node) {
    return node.literal;
};
var tokens, FunctionArguments = function (node) {
    res = transpile(node.children);
    return "(" + res.join(', ') + ")";
};
var tokens, FunctionArgument = function (node) {
    res = transpile(node.children);
    var arr = [];
    res.forEach(function (arg) {
        return ;
        if (arg[0] === ':') {
            var arr_1 = (_a = "" + arr_1[arr_1.length - 1] + arg, arr_1.length - 1 = _a[0], _a);
        }
        else {
            arr.push(arg);
        }
        ;
        var _a;
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
    ;
    res = res.map(function (text) {
        return "" + text;
    });
    res.push("}");
    res.unshift('{\n');
    return [args, res];
};
var tokens, FunctionExpression = function (node) {
    var _a = functionManage(node), args = _a[0], res = _a[1];
    return "function " + args + " " + res.join('');
};
var tokens, ArrowFunction = function (node) {
    _a = functionManage(node), args = _a[0], res = _a[1];
    return args + " => " + res.join('');
    var _a;
};
var tokens, FunctionCall = function (node) {
    res = transpile(node.children);
    var variableName = res.shift();
    return "" + variableName + res.join('');
};
var tokens, Call = function (node) {
    res = transpile(node.children);
    return "(" + res.join('') + ")";
};
var tokens, CallArg = function (node) {
    res = transpile(node.children);
    return res.join(', ');
};
var tokens, Object = function (node) {
    res = transpile(node.children);
    return "{" + res.join(', ') + "}";
};
var tokens, ObjectDestruct = function (node) {
    res = transpile(node.children);
    return "{" + res.join(', ') + "}";
};
var tokens, ArrayDestruct = function (node) {
    res = transpile(node.children);
    return "[" + res.join(', ') + "]";
};
var tokens, ObjectProperties = function (node) {
    res = transpile(node.children);
    var pairs = _.chunk(res, 2);
    var objs = pairs.map(function (pair) {
        return pair.join(': ');
    });
    return "" + objs.join(', ');
};
var tokens, Array = function (node) {
    res = transpile(node.children);
    return "[" + res.join(', ') + "]";
};
var tokens, ArrayProperties = function (node) {
    res = transpile(node.children);
    return "" + res.join(', ');
};
var tokens, ComputedProperties = function (node) {
    res = transpile(node.children);
    return res.join('');
};
var tokens, ComputedProperty = function (node) {
    res = transpile(node.children);
    return res.join('');
};
var tokens, ComputedPropertiesDots = function (node) {
    res = transpile(node.children);
    if (node.children[0].symbol === 'NumericComputedProperty') {
        return ("" + res.join(''));
    }
    ;
    return "." + res.join('.');
};
var tokens, ComputedPropertiesBraces = function (node) {
    res = transpile(node.children);
    return "[" + res.join('') + "]";
};
var tokens, NumericComputedProperty = function (node) {
    res = transpile(node.children);
    return "[" + node.literal + "]";
};
var tokens, BooleanExpr = function (node) {
    res = transpile(node.children);
    return res.join(' ');
};
var tokens, If = function (node) {
    res = transpile(node.children);
    var condition = res.shift();
    return "if (" + condition + ") " + res.join('') + "\n";
};
var tokens, ElseIf = function (node) {
    res = transpile(node.children);
    condition = res.shift();
    return "else if (" + condition + ") " + res.join('') + "\n";
};
var tokens, Else = function (node) {
    res = transpile(node.children);
    return " else " + res.join('') + "\n";
};
var tokens, Try = function (node) {
    res = transpile(node.children);
    return "try " + res.join('') + "\n";
};
var tokens, Catch = function (node) {
    res = transpile(node.children);
    var cond = '';
    if (res.length === 2) {
        cond = res.shift();
    }
    ;
    return "catch (" + cond + ")" + res.join('') + "\n";
};
var tokens, While = function (node) {
    res = transpile(node.children);
    condition = res.shift();
    return "while (" + condition + ") " + res.join('') + "\n";
};
var tokens, For = function (node) {
    res = transpile(node.children);
    console.log(res);
    condition = res.shift();
    return "for (" + condition + ") " + res.join('') + "\n";
};
var tokens, ForCond = function (node) {
    res = transpile(node.children);
    console.log(res);
    return "" + res.join('');
};
var tokens, Test = function (node) {
    res = transpile(node.children);
    return "" + res.join(' ');
};
var tokens, TestOp = function (node) {
    if (node.literal === 'is') {
        return ('===');
    }
    else if (node.literal === 'isnt') {
        return ('!==');
    }
    else if (node.literal === 'and') {
        return ('&&');
    }
    else if (node.literal === 'or') {
        return ('||');
    }
    ;
    return node.literal;
};
var tokens, Unary = function (node) {
    return node.literal;
};
var tokens, Not = function (node) {
    res = transpile(node.children);
    return "!" + res.join('');
};
var tokens, Operation = function (node) {
    res = transpile(node.children);
    return "" + res.join(' ');
};
var tokens, Operator = function (node) {
    return node.literal;
};
var tokens, Return = function (node) {
    res = transpile(node.children);
    return "return " + res.join(' ');
};
var tokens, Throw = function (node) {
    res = transpile(node.children);
    return "throw " + res.join(' ');
};
var tokens, Class = function (node) {
    res = transpile(node.children);
    return "class " + res.join(' ');
};
var tokens, ClassBlock = function (node) {
    currentBlockIndent + 2;
    res = transpile(node.children);
    indent = _.repeat(' ', currentBlockIndent);
    currentBlockIndent - 2;
    res = res.map(function (text) {
        return "" + indent + text;
    });
    res.unshift('{\n');
    res.push(_.repeat(' ', currentBlockIndent) + "}");
    return res.join('');
};
var tokens, ClassStatement = function (node) {
    res = transpile(node.children);
    return res.join('') + "\n";
};
var tokens, ClassMethodDeclaration = function (node) {
    res = transpile(node.children);
    return res.join('') + "\n";
};
var tokens, ClassMethod = function (node) {
    res = transpile(node.children);
    return res.join('') + "\n";
};
var transpile = function (nodes) {
    if (!nodes.length) {
        return ([]);
    }
    ;
    return nodes.map(function (node) {
        var token = tokens[node.symbol];
        if (!node.symbol) {
            return (node.literal);
        }
        ;
        if (token({ "return": , token: token, node: node }))
            ;
        return transpile(node.children).join('');
    });
};
var _transpile = function (ast) {
    variables = [];
    types = {};
    return transpile(ast.children).join('');
};
var module, exports = _transpile;
