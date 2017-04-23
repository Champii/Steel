If
  = "if"
    ws ass:Expression ws
    body:Block
    other:(
      ElseIf
    / Else
    )?
  { return createNode('If', _.compact([ass, body, other])); }

ElseIf
  = EndOfLine ws "else if"
    ws ass:Expression ws
    body:Block
    other:(
      ElseIf
    / Else
    )?
  { return createNode('ElseIf', _.compact([ass, body, other])); }

Else
  = EndOfLine ws "else"
    body:Block
  { return createNode('Else', body); }
