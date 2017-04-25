{
  const _ = require('lodash');
  let variables   = [];
  let types       = {};
  let indentCount = 0;

  const Assignation = (identifier, assignable) => {
    if (!variables.includes(identifier)) {
      variables.push(identifier);
      identifier = `let ${identifier}`;
    }

    return `${identifier} = ${assignable}`;
  };

  const FunctionDeclaration = (args, noReturn, template, body) => {
    if (noReturn != null) {
      noReturn = createNode('NoReturn', [], '!');
    }

    if (args === null) {
      const argId = createNode('Identifier', [], 'it?');
      args = createNode('FunctionArguments', [argId]);
    }

    template.children.push(args, noReturn, body);

    template.children = _.compact(template.children);

    return createNode('FunctionDeclaration', template);
  };

  const FunctionShorthand = (op, ass) => {
    const argId = createNode('Identifier', [], 'it');
    const finalId = createNode('Identifier', [], `it${op.literal}${ass.literal}`);
    const statm = createNode('Statement', [finalId]);
    const block = createNode('FunctionBlock', [statm]);
    const args = createNode('FunctionArguments', [argId]);
    const template = createNode('FunctionExpression', [args, block]);

    return createNode('FunctionDeclaration', template);
  };

  const BlockIndentation = (body, open, close) => {
    // const indent = indentCount;


    // close = (' ').repeat(indentCount) + close

    const res = body.map(item => (' ').repeat(indentCount) + item);
    indentCount -= 2;

    // res.unshift(open + '\n');
    // res.push(close);

    return body.join('');
  };

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
}

Root
  = head:Statement+
  { return createNode('Root', head); }
