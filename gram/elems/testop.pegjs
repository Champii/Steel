TestOp
  = op:(
      (
        o:(
          "isnt"
        / "is"
        / "and"
        / "or"
        )
        " "
        { return o; }
      )
      /
      (
        "==="
      / "!=="
      / "=="
      / "!="
      / ">="
      / "<="
      / ">"
      / "<"
      / "&&"
      / "||"
    )
  )
  { return createNode('TestOp', [], op); }
