FunctionDeclaration "FunctionDeclaration"
  = generics:GenericFunctionDeclaration?
    args:FunctionArguments?
    ws noReturn: "!"? ws
    template:(
      FunctionExpressionCurry
    / ArrowFunctionCurry
    / FunctionExpression
    / ArrowFunction
    )
    body:FunctionBlock
  { return FunctionDeclaration(args, noReturn, template, body, generics); }

GenericFunctionDeclaration
  = "<" ws GenericFunctionDeclarationRecur ws ">"
  { return createNode('GenericFunctionDeclaration', [], text()); }

GenericFunctionDeclarationRecur
  = Identifier (Coma GenericFunctionDeclarationRecur)?
  { return text(); }

FunctionExpression "FunctionExpression"
  = ws "->" ws
  { return createNode('FunctionExpression', []); }

ArrowFunction "ArrowFunction"
  = ws "~>" ws
  { return createNode('ArrowFunction', []); }

FunctionExpressionCurry "FunctionExpressionCurry"
  = ws "-->" ws
  { return createNode('FunctionExpressionCurry', []); }

ArrowFunctionCurry "ArrowFunctionCurry"
  = ws "~~>" ws
  { return createNode('ArrowFunctionCurry', []); }

FunctionArguments "FunctionArguments"
  = "(" ws
    args:FunctionArgument?
    ws ")"
    returnType:FunctionReturnType?
  { return createNode('FunctionArguments', _.compact([...args, returnType])); }

FunctionReturnType
  = Colon
    id:Type
  { return createNode('FunctionReturnType', [], id); }

FunctionArgument "FunctionArgument"
  = head:Identifier
    type:InlineTypeDeclaration?
    tail:FunctionArgumentComa?
  {
    if (type) {
      head.literal = head.literal + ':' + type.literal;
    }

    return _([head].concat(tail))
      .flatten()
      .compact()
      .value()
    ;
  }

FunctionArgumentComa "FunctionArgumentComa"
  = Coma
    arg:FunctionArgument
  { return arg; }
