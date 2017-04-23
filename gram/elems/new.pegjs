New
  = "new "
    body:(
      FunctionCall
    / Identifier
    )
  { return createNode('New', body); }
