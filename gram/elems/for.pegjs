For
  = "for"
    cond:ForCond
    body:Block
  { return createNode('For', _.compact([cond, body])); }

ForCond
  = ws ass:Assignation? ws
    ";"
    ws ex1:Expression? ws
    ";"
    ws ex2:Expression? ws
  { return createNode('ForCond', _.compact([ass, ex1, ex2])); }
