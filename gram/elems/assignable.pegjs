Assignable "Assignable"
  = ass:(
      Literal
    / Unary
    / ComputedProperty
    / ChainedCall
    / Array
    / Object
    / New
    / This
    / FunctionCall
    / FunctionDeclaration
    / FunctionShorthand
    / Not
    / Identifier
    )
    ex:Existance?
  {
    if (ex) {
      return createNode('Existance', ass);
    }

    return ass;
  }

ParensAssignable "ParensAssignable"
  = "(" ws
    ass:Expression
    ws ")"
  { return createNode('ParensAssignable', _.compact([ass])); }
