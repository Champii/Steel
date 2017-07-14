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
  = Identifier ('.' Type)?
  { return text(); }
