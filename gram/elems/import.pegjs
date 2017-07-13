Require
  = "require" ws
    block:ImportBlock
  { return createNode('Require', block); }

Import
  = ("import") ws
    block:ImportBlock
  { return createNode('Import', block); }

ImportBlock
  = IndentBlockOpen
    body:ImportLine+
    IndentBlockClose
  { return createNode('ImportBlock', body); }

ImportLine
  = ws
    body:(
      StringLiteral
    / Identifier
    )
    from:ImportFrom?
    EndOfLine
  { return createNode('ImportLine', _.compact([body, from])); }

ImportFrom
  = Colon
    body:(
      Identifier
    / ObjectDestruct
    / ArrayDestruct
    )
  { return createNode('ImportFrom', body); }
