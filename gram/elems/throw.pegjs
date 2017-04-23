Throw
  = ws "throw" ws
    expr:Expression
  { return createNode('Throw', expr); }
