Literal "Literal"
  = body:(
      String
    / TemplateString
    / Number
    )
  { return createNode('Literal', body); }

String "String"
  = SingleQuote
    (DoubleQuote / Char / "`")*
    SingleQuote
  { return createNode('String', [], text()); }

TemplateString "TemplateString"
  = BackQuote
    (Char / "'" / DoubleQuote / EndOfLine)*
    BackQuote
  { return createNode('TemplateString', [], text()); }

SingleQuote "SingleQuote"
  = "'"

DoubleQuote "DoubleQuote"
  = '"'

BackQuote "BackQuote"
  = "`"

SingleQuoteChar
  = !(SingleQuote)
    c:Char
  { return c; }

DoubleQuoteChar
  = !(DoubleQuote)
    c:Char
  { return c; }

Char "Char"
  = Unescaped
  / Escape sequence:(
      "`"
    / SingleQuote
    / DoubleQuote
    / "\\"
    / "/"
    / "b" { return "\b"; }
    / "f" { return "\f"; }
    / "n" { return "\n"; }
    / "r" { return "\r"; }
    / "t" { return "\t"; }
  )
  { return sequence; }

Escape "Escape"
  = "\\"

Unescaped "Unescaped"
  = [^\0-\x1F\x22\x5C'`]

Number "Number"
  = [0-9]+
  { return createNode('Number', [], text()); }
