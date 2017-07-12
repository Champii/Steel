Assignation "Assignation"
  = head:(
      ComputedProperty
    / ObjectDestruct
    / ArrayDestruct
    / Identifier
    )
    ws
    type:InlineTypeDeclaration?
    AssignationOp
    tail:Expression
  { return createNode('Assignation', _.compact([head, tail, type]), text()); }
