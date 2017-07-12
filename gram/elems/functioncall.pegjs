FunctionCall
  = ident:Identifier
    call:Call ws
  { return createNode('FunctionCall', [ident, call]); }

Call
  = call:(
      ParensCall
    / SpaceCall
    / BangCall
    )
  { return createNode('Call', call); }

ParensCall
  = "(" ws
    args: CallArg?
    ws ")"
  { return createNode('ParensCall', args || []); }

SpaceCall
  = " "+
    args: CallArg
    ws
  { return createNode('SpaceCall', args); }

BangCall
  = "!"
  { return createNode('BangCall', []); }

CallArg
  = args:CallArg_
  { return createNode('CallArg', args); }
CallArg_
  = head: (Operation / Assignable)
    tail: CallArgComa?
  {
    return _([head].concat(tail))
      .flatten()
      .compact()
      .value()
    ;
  }

CallArgComa
  = LineSpace?
    Coma
    arg: CallArg
  { return arg; }
