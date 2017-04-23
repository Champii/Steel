FunctionShorthand
  = "(" ws
    op:ShorthandOp
    ws
    ass:Assignable
    ws ")"
  { return FunctionShorthand(op, ass); }

ShorthandOp
  = op:(
      Operator
    / TestOp
    / (".") {return { literal: '.' }}
    )
  { return createNode('ShorthandOp', op); }
