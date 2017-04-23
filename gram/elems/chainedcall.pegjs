ChainedCall
  = left:ChainedCallType
    right:ChainedCallRight+
  { return createNode('ChainedCall', [left, ...right]); }

ChainedCallRight
  = LineSpace?
    "|>" ws
    right:ChainedCallType
  { return right; }

ChainedCallType
  = Literal
  / FunctionCall
  / This
  / Identifier
  / Array
  / Object
  / ComputedProperty
  / Identifier
