ComputedProperty
  = prop:(
      ComputedPropertyDirect
    / ComputedPropertyIndirect
    )
  { return createNode('ComputedProperty', prop); }

ComputedPropertyDirect
  = id:This
    prop:ComputedPropertiesTypes+
  { return createNode('ComputedPropertyDirect', _.compact([id, ...prop])); }

ComputedPropertyIndirect
  = id:(
      Literal
    / This
    / FunctionCall
    / Identifier
    / Array
    / Object
    )
    prop:PossibleComputedProperties+
  { return createNode('ComputedPropertyIndirect', _.compact([id, ...prop])); }

PossibleComputedProperties
  = prop:(
      ComputedPropertiesDots
    / ComputedPropertiesBraces
    )
    call:Call?
  { return createNode('PossibleComputedProperties', _.compact([prop, call])); }

ComputedPropertiesBraces
  = BraceOpen
    prop:ComputedPropertiesTypes
    ws "]"
  {
    return createNode('ComputedPropertiesBraces', _.compact([prop]));
  }

ComputedPropertiesDots
  = ComputedPropertiesDotsBlock
  / ComputedPropertiesDotsInline

ComputedPropertiesDotsInline
  = Dot
    prop:(
      NumericComputedProperty
    / ComputedPropertiesTypes
    )
  { return createNode('ComputedPropertiesDots', _.compact([prop])); }

ComputedPropertiesDotsBlock
  = "@{\n" ws
    prop:ComputedPropertiesDotsInline
    "\n@}"
  { return prop; }

ComputedPropertiesTypes
  = Literal
  / FunctionCall
  / ComputedPropertyIndirect
  / Operation
  / Identifier

NumericComputedProperty
  = NumericLiteral
  { return createNode('NumericComputedProperty', [], text()); }
