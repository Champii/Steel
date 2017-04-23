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
    / FunctionCall
    / This
    / Identifier
    / Array
    / Object
    )
    prop:PossibleComputedProperties+
  { return createNode('ComputedPropertyIndirect', _.compact([id, ...prop])); }

PossibleComputedProperties
  = LineSpace?
    prop:(
      ComputedPropertiesDots
    / ComputedPropertiesBraces
    )
    call:Call? ws
  { return createNode('PossibleComputedProperties', _.compact([prop, call])); }

ComputedPropertiesBraces
  = BraceOpen
    prop:ComputedPropertiesTypes
    ws "]"
  {
    return createNode('ComputedPropertiesBraces', _.compact([prop]));
  }

ComputedPropertiesDots
  = Dot
    prop:(
      NumericComputedProperty
    / ComputedPropertiesTypes
    )
  { return createNode('ComputedPropertiesDots', _.compact([prop])); }

ComputedPropertiesTypes
  = Literal
  / ComputedProperty
  / FunctionCall
  / Operation
  / Identifier

NumericComputedProperty
  = Number
  { return createNode('NumericComputedProperty', [], text()); }
