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
  { return id; }

InlineTypeDeclaration
  = ws ":" ws
    id:Type
  { return id; }

Type
  = type:(
      (Identifier Dot Type) { return text(); }
    / Identifier
    )
  { return type; }
