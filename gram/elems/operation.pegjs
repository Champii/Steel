Operation
  = left:Assignable
    ws
    op:Operator
    ws
    right:(
      Operation
    / Assignable
    )
  { return createNode('Operation', [left, op, right]); }

Operator
  = op:(
      "+"
    / "-"
    / "*"
    / "/"
    )
    eq:"="?
  { return createNode('Operator', [], op + (eq || '')); }
