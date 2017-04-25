"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let ts = require('typescript');
let util = require('util');
let path = require('path');
let tokens = {};
let variables = [[]];
let types = {};
let hasCurry = false;
let currentBlockIndent = 0;
let hasVariable = function (vari) {
    return _.some(variables, function (scope) {
        return scope.includes(vari);
    });
};
let pushScope = function (it) {
    return variables.push([]);
};
let popScope = function (it) {
    return variables.pop();
};
let addVariable = function (vari) {
    return variables[variables.length - 1].push(vari);
};
tokens.TypeAssignation = function (node) {
    let res = transpile(node.children);
    let variable = res.shift();
    types[variable] = res[0];
    return '';
};
tokens.TypeExpression = function (node) {
    return transpile(node.children);
};
tokens.Statement = function (node) {
    let res = transpile(node.children);
    let text = `${res.join('')}`;
    if (['Import', 'If', 'Try', 'While', 'For'].includes(node.children[0].symbol)) {
        return `${text}`;
    }
    if (!res[0]) {
        return '';
    }
    if (res[0][res[0].length - 2] === ';' && res[0][res[0].length - 1] === '\n') {
        return text;
    }
    return `${text};\n`;
};
let applyTypes = function (type, node) {
    if (type.length === 1) {
        return `:${type[0]}`;
    }
    let funcArgs = node.children[1].children[0].children[0];
    let argsNode = [];
    if (funcArgs.symbol === 'FunctionArguments') {
        argsNode = transpile(funcArgs.children);
    }
    let returnType = type.pop();
    if (type.length !== argsNode.length) {
        throw 'Type declaration mismatch identifier declatation';
    }
    let argsTypes = argsNode.map(function (arg, i) {
        return `${arg}:${type[i]}`;
    });
    return `:(${argsTypes}) => ${returnType}`;
};
tokens.Assignation = function (node) {
    let res = transpile(node.children);
    let text = '';
    if (!hasVariable(res[0]) && !['ComputedProperty', 'ComputedPropertyDirect'].includes(node.children[0].symbol)) {
        text += 'let ';
        addVariable(res[0]);
    }
    if (res[2]) {
        res[0] = `${res[0]}:${res[2]}`;
        res.splice(2, 1);
    }
    else if (types[res[0]]) {
        res[0] = `${res[0]}${applyTypes(types[res[0]], node)}`;
    }
    return `${text}${res.join(' = ')}`;
};
tokens.Existance = function (node) {
    let res = transpile(node.children);
    return `(${res[0]} != null)`;
};
tokens.ParensAssignable = function (node) {
    let res = transpile(node.children);
    let parens = res.shift();
    return `(${res.join('')})`;
};
tokens.ParensExpression = function (node) {
    let res = transpile(node.children);
    let parens = res.shift();
    return `(${parens})${res.join('')}`;
};
tokens.Identifier = function (node) {
    return node.literal;
};
tokens.Block = function (node) {
    currentBlockIndent += 2;
    let res = transpile(node.children);
    let indent = _.repeat(' ', currentBlockIndent);
    currentBlockIndent -= 2;
    res = res.map(function (text) {
        return `${indent}${text}`;
    });
    res.unshift('{\n');
    res.push(`${_.repeat(' ', currentBlockIndent)}}`);
    return res.join('');
};
tokens.FunctionBlock = function (node) {
    currentBlockIndent += 2;
    pushScope();
    let res = transpile(node.children);
    popScope();
    let indent = _.repeat(' ', currentBlockIndent);
    currentBlockIndent -= 2;
    res = res.map(function (text) {
        return `${indent}${text}`;
    });
    res.push(`${_.repeat(' ', currentBlockIndent)}`);
    return res.join('');
};
tokens.Literal = function (node) {
    return node.literal;
};
tokens.FunctionArguments = function (node) {
    let returnType = '';
    if (node.children.length && node.children[node.children.length - 1].symbol === 'FunctionReturnType') {
        returnType = `: ${node.children.pop().literal}`;
    }
    let res = transpile(node.children);
    res.forEach(addVariable);
    return `(${res.join(', ')})${returnType}`;
};
tokens.FunctionArgument = function (node) {
    let res = transpile(node.children);
    let arr = [];
    res.forEach(function (arg) {
        if (arg[0] === ':') {
            arr[arr.length - 1] = `${arr[arr.length - 1]}${arg}`;
        }
        else {
            arr.push(arg);
        }
    });
    return arr;
};
let functionManage = function (node) {
    let res = transpile(node.children);
    let args = '()';
    if (res[0] && res[0][0] === '(') {
        args = res[0];
        res.shift();
    }
    res = res.map(function (text) {
        return `${text}`;
    });
    res.push(`}`);
    res.unshift('{\n');
    return [args, res];
};
tokens.FunctionReturnType = function (node) {
    let res = transpile(node.children);
    return res.join('');
};
tokens.FunctionExpression = function (node) {
    let [args, res] = functionManage(node);
    return `function ${args} ${res.join('')}`;
};
tokens.ArrowFunction = function (node) {
    let [args, res] = functionManage(node);
    return `${args} => ${res.join('')}`;
};
tokens.FunctionExpressionCurry = function (node) {
    hasCurry = true;
    let [args, res] = functionManage(node);
    return `curry$(function ${args} ${res.join('')})`;
};
tokens.ArrowFunctionCurry = function (node) {
    hasCurry = true;
    let [args, res] = functionManage(node);
    return `curry$(${args} => ${res.join('')})`;
};
tokens.FunctionCall = function (node) {
    let res = transpile(node.children);
    let variableName = res.shift();
    return `${variableName}${res.join('')}`;
};
tokens.Call = function (node) {
    let res = transpile(node.children);
    return `(${res.join('')})`;
};
tokens.CallArg = function (node) {
    let res = transpile(node.children);
    return res.join(', ');
};
tokens.Object = function (node) {
    let res = transpile(node.children);
    return `{${res.join(', ')}}`;
};
tokens.ObjectDestruct = function (node) {
    let res = transpile(node.children);
    return `{${res.join(', ')}}`;
};
tokens.ArrayDestruct = function (node) {
    let res = transpile(node.children);
    return `[${res.join(', ')}]`;
};
tokens.ObjectProperties = function (node) {
    let res = transpile(node.children);
    let pairs = _.chunk(res, 2);
    let objs = pairs.map(function (pair) {
        if (pair[0][0] === '`') {
            pair[0] = `[${pair[0]}]`;
        }
        return pair;
    }).map(function (pair) {
        return pair.join(': ');
    });
    return `${objs.join(', ')}`;
};
tokens.Array = function (node) {
    let res = transpile(node.children);
    return `[${res.join(', ')}]`;
};
tokens.ArrayProperties = function (node) {
    let res = transpile(node.children);
    return `${res.join(', ')}`;
};
tokens.ComputedProperty = function (node) {
    let res = transpile(node.children);
    return res.join('');
};
tokens.ComputedPropertiesDots = function (node) {
    let res = transpile(node.children);
    if (node.children[0].symbol === 'NumericComputedProperty') {
        return `${res.join('')}`;
    }
    return `.${res.join('.')}`;
};
tokens.ComputedPropertyDirect = function (node) {
    let res = transpile(node.children);
    return res.join('.');
};
tokens.ComputedPropertiesBraces = function (node) {
    let res = transpile(node.children);
    return `[${res.join('')}]`;
};
tokens.NumericComputedProperty = function (node) {
    let res = transpile(node.children);
    return `[${node.literal}]`;
};
tokens.BooleanExpr = function (node) {
    let res = transpile(node.children);
    return res.join(' ');
};
tokens.If = function (node) {
    let res = transpile(node.children);
    let condition = res.shift();
    return `if (${condition}) ${res.join('')}\n`;
};
tokens.ElseIf = function (node) {
    let res = transpile(node.children);
    let condition = res.shift();
    return `else if (${condition}) ${res.join('')}\n`;
};
tokens.Else = function (node) {
    let res = transpile(node.children);
    return ` else ${res.join('')}\n`;
};
tokens.Try = function (node) {
    let res = transpile(node.children);
    return `try ${res.join('')}\n`;
};
tokens.Catch = function (node) {
    let res = transpile(node.children);
    let cond = '';
    if (res.length === 2) {
        cond = res.shift();
    }
    return `catch (${cond})${res.join('')}\n`;
};
tokens.While = function (node) {
    let res = transpile(node.children);
    let condition = res.shift();
    return `while (${condition}) ${res.join('')}\n`;
};
tokens.For = function (node) {
    let res = transpile(node.children);
    let condition = res.shift();
    return `for (${condition}) ${res.join('')}\n`;
};
tokens.ForCond = function (node) {
    let res = transpile(node.children);
    return `${res.join(';')}`;
};
tokens.Test = function (node) {
    let res = transpile(node.children);
    return `${res.join(' ')}`;
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
    let res = transpile(node.children);
    return res.join('');
};
tokens.UnaryOp = function (node) {
    return node.literal;
};
tokens.Not = function (node) {
    let res = transpile(node.children);
    return `!${res.join('')}`;
};
tokens.Operation = function (node) {
    let res = transpile(node.children);
    return `${res.join(' ')}`;
};
tokens.Operator = function (node) {
    return node.literal;
};
tokens.Return = function (node) {
    let res = transpile(node.children);
    return `return ${res.join(' ')}`;
};
tokens.Throw = function (node) {
    let res = transpile(node.children);
    return `throw ${res.join(' ')}`;
};
tokens.Class = function (node) {
    let res = transpile(node.children);
    if (node.children[node.children.length - 1].symbol === 'Extends') {
        res.splice(1, 0, res.pop());
    }
    if (node.children[node.children.length - 1].symbol !== 'ClassBlock') {
        res.push('{}');
    }
    return `class ${res.join(' ')}`;
};
tokens.Extends = function (node) {
    let res = transpile(node.children);
    return `extends ${res[0]}`;
};
tokens.ClassBlock = function (node) {
    currentBlockIndent += 2;
    let res = transpile(node.children);
    let indent = _.repeat(' ', currentBlockIndent);
    currentBlockIndent -= 2;
    res = res.map(function (text) {
        return `${indent}${text}`;
    });
    res.unshift('{\n');
    res.push(`${_.repeat(' ', currentBlockIndent)}}`);
    return res.join('');
};
tokens.ClassStatement = function (node) {
    let res = transpile(node.children);
    return `${res.join('')}\n`;
};
tokens.ClassMethodDeclaration = function (node) {
    let res = transpile(node.children);
    return `${res.join('')}`;
};
tokens.ClassPropertyDeclaration = function (node) {
    let res = transpile(node.children);
    return `${res.join(' = ')};`;
};
tokens.ClassMethod = function (node) {
    let res = _.compact(transpile(node.children[0].children));
    let args = '()';
    if (res.length > 1) {
        args = res.shift();
    }
    res.unshift('{\n');
    res.push(`${_.repeat(' ', currentBlockIndent - 2)}}`);
    return `${args} ${res.join('')}`;
};
tokens.Interface = function (node) {
    let res = transpile(node.children);
    return `interface ${res.join(' ')}`;
};
tokens.InterfaceBlock = function (node) {
    currentBlockIndent += 2;
    let res = transpile(node.children);
    let indent = _.repeat(' ', currentBlockIndent);
    currentBlockIndent -= 2;
    res = res.map(function (text) {
        return `${indent}${text}`;
    });
    res.unshift('{\n');
    res.push(`${_.repeat(' ', currentBlockIndent)}}`);
    return res.join('');
};
tokens.BlockTypeDeclaration = function (node) {
    let res = transpile(node.children);
    let ex = '';
    if (res.length === 3) {
        ex = '?';
    }
    return `${res[0]}${ex}:${res[1]};\n`;
};
tokens.New = function (node) {
    let res = transpile(node.children);
    return `new ${res.join('')}`;
};
tokens.ChainedCall = function (node) {
    let res = transpile(node.children);
    res = _.reduce(res, function (acc, i) {
        return `(${i}${acc})`;
    }, '');
    return res;
};
tokens.This = function (node) {
    return 'this';
};
tokens.Import = function (node) {
    let res = transpile(node.children);
    return `${res.join('')}`;
};
let importNativeEs5 = function (node) {
    let id = node.children[0].literal;
    if (node.children.length === 1) {
        return `import * as ${id} from '${id}';\n`;
    }
    let fromId = node.children[1];
    if (fromId.children[0].symbol === 'Identifier') {
        return `import * as ${fromId.children[0].literal} from '${id}';\n`;
    }
    return `import ${transpile(fromId.children).join('')} from '${id}';\n`;
};
let importCommonJs = function (node) {
    let id = node.children[0].literal;
    if (node.children[0].symbol === 'String') {
        id = id.substr(1, id.length - 2);
    }
    if (node.children.length === 1 && node.children[0].symbol === 'String') {
        let val = id;
        if (val[0] === '.' && val[1] === '/') {
            val = path.basename(val);
        }
        return `import ${val} = require('${id}');\n`;
    }
    if (node.children.length === 1) {
        return `import ${id} = require('${id}');\n`;
    }
    let fromId = node.children[1];
    if (fromId.children[0].symbol === 'Identifier') {
        return `import ${fromId.children[0].literal} = require('${id}');\n`;
    }
    if (fromId.children[0].symbol === 'ObjectDestruct') {
        let destruct = transpile(fromId.children).join('');
        let res = `import _${id} = require('${id}');\n`;
        res += `let ${destruct} = _${id};\n`;
        return res;
    }
    return `import ${transpile(fromId.children).join('')} = require('${id}');\n`;
};
tokens.ImportLine = function (node) {
    let forcedVersion = 'common';
    if (forcedVersion === 'common') {
        return importCommonJs(node);
    }
    else if (forcedVersion === 'native') {
        return importNativeEs5(node);
    }
};
let curryFunction = `function curry$(f, bound?){ var context, _curry = function(args?){ return f.length > 1 ? function(){ var params = args ? args.concat() :[]; context = bound ? context || this : this; return params.push.apply(params, arguments) < f.length && arguments.length ? _curry.call(context, params) : f.apply(context, params); } : f; }; return _curry(); }`;
let addCurryDeclaration = function (res) {
    if (hasCurry) {
        return res + curryFunction;
    }
    return res;
};
let transpile = function (nodes) {
    if (!nodes.length) {
        return [];
    }
    return nodes.map(function (node) {
        let token = tokens[node.symbol];
        if (!node.symbol) {
            return node.literal;
        }
        if (token) {
            return token(node);
        }
        return transpile(node.children).join('');
    });
};
let _transpile = function (pair) {
    let ast = pair[1];
    variables = [[]];
    types = {};
    hasCurry = false;
    pair[1] = addCurryDeclaration(transpile(ast.children).join(''));
    pair[1] = `(function () {\n${pair[1]}})();`;
    return pair;
};
module.exports = _transpile;