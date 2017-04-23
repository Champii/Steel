Unary
  = body:(
      ComputedProperty
    / Identifier
    )
    op:UnaryOp
  { return createNode('Unary', [body, op]); }

UnaryOp
  = op:(
      "++"
    / "--"
  )
  { return createNode('UnaryOp', [], text()); }
