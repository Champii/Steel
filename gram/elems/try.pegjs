Try
  = "try"
    body:Block
    other:Catch?
  { return createNode('Try', _.compact([body, other])); }

Catch
  = EndOfLine ws "catch" ws
    id: Identifier?
    body:Block
  { return createNode('Catch', _.compact([id, body])); }
