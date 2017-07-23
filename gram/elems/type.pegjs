TypeAssignation
  = id:Identifier
    ws ":=" ws
    expr:TypeExpression
  { return createNode('TypeAssignation', [id, expr]); }

TypeExpression
  = id:Identifier
    expr:FunctionTypeExpression*
  { return createNode('TypeExpression', [id].concat(expr)); }

FunctionTypeExpression
  = ws "->" ws
    id:Type
  { return createNode('InlineTypeDeclaration', [], id); }

InlineTypeDeclaration
  = ws ":" ws
    id:Type
  { return createNode('InlineTypeDeclaration', [], id); }

Type
  = FuncType / (TypeName GenericType? "[]"*)
  { return text(); }

FuncType
  = args:( "(" ws FunctionArgument? ws ")" { return text(); } )
    returnType:(FunctionReturnType? { return text().replace(':', '=>')})
  { return args + (returnType || ''); }
  // { return createNode('FuncType', type.children); }

GenericType
  = "<" ws Type ws ">"

TypeName
  = Identifier ('.' Type)?
  { return text(); }
