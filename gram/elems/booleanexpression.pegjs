BooleanExpr
  = left:(
      Operation
    / Assignable
    )
    ws
    test:TestOp
    ws
    right:(
      BooleanExpr
    / Operation
    / Assignable
    )
  { return createNode('BooleanExpr', [left, test, right]); }
