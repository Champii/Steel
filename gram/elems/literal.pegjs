// Literal "Literal"
//   = body:(
//       String
//     / TemplateString
//     / Number
//     )
//   { return createNode('Literal', body); }

// String "String"
//   = SingleQuote
//     (DoubleQuote / Char / "`")*
//     SingleQuote
//   { return createNode('String', [], text()); }

// TemplateString "TemplateString"
//   = BackQuote
//     (Char / "'" / DoubleQuote / EndOfLine)*
//     BackQuote
//   { return createNode('TemplateString', [], text()); }

// SingleQuote "SingleQuote"
//   = "'"

// DoubleQuote "DoubleQuote"
//   = '"'

// BackQuote "BackQuote"
//   = "`"

// SingleQuoteChar
//   = !(SingleQuote)
//     c:Char
//   { return c; }

// DoubleQuoteChar
//   = !(DoubleQuote)
//     c:Char
//   { return c; }

// Char "Char"
//   = Unescaped
//   / Escape sequence:(
//       "`"
//     / SingleQuote
//     / DoubleQuote
//     / "\\"
//     / "/"
//     / "b" { return "\b"; }
//     / "f" { return "\f"; }
//     / "n" { return "\n"; }
//     / "r" { return "\r"; }
//     / "t" { return "\t"; }
//   )
//   { return sequence; }

// Escape "Escape"
//   = "\\"

// Unescaped "Unescaped"
//   = [^\0-\x1F\x22\x5C'`]

// Number "Number"
//   = [0-9]+
//   { return createNode('Number', [], text()); }

Literal
  = body:(
      NullLiteral
    / BooleanLiteral
    / NumericLiteral
    / StringLiteral
    // / RegularExpressionLiteral
    )
  { return createNode('Literal', body); }

NullLiteral
  = NullToken
  { return createNode('NullLiteral', [], text()); }

BooleanLiteral
  = TrueToken
  / FalseToken
  { return createNode('BooleanLiteral', [], text()); }

// The "!(IdentifierStart / DecimalDigit)" predicate is not part of the official
// grammar, it comes from text in section 7.8.3.
NumericLiteral "number"
  = literal:(
      HexIntegerLiteral
    / DecimalLiteral
    )
    !(IdentifierStart / DecimalDigit)
  { return createNode('NumericLiteral', literal); }

DecimalLiteral
  = DecimalIntegerLiteral "." DecimalDigit* ExponentPart?
  / "." DecimalDigit+ ExponentPart?
  / DecimalIntegerLiteral ExponentPart?
  { return createNode('DecimalLiteral', [], parseFloat(text())); }

DecimalIntegerLiteral
  = "0"
  / NonZeroDigit DecimalDigit*

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

ExponentPart
  = ExponentIndicator SignedInteger

ExponentIndicator
  = "e"i

SignedInteger
  = [+-]? DecimalDigit+

HexIntegerLiteral
  = "0x"i digits:$HexDigit+
  { return createNode('HexIntegerLiteral', [], parseInt(digits, 16)); }

HexDigit
  = [0-9a-f]i

StringLiteral "string"
  = '"' chars:DoubleStringCharacter* '"'
  / "'" chars:SingleStringCharacter* "'"
  { return createNode('StringLiteral', [], text()); }

DoubleStringCharacter
  = !('"' / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation

SingleStringCharacter
  = !("'" / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation

LineContinuation
  = "\\" LineTerminatorSequence { return ""; }

EscapeSequence
  = CharacterEscapeSequence
  / "0" !DecimalDigit { return "\0"; }
  / HexEscapeSequence
  / UnicodeEscapeSequence

CharacterEscapeSequence
  = SingleEscapeCharacter
  / NonEscapeCharacter

SingleEscapeCharacter
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b"; }
  / "f"  { return "\f"; }
  / "n"  { return "\n"; }
  / "r"  { return "\r"; }
  / "t"  { return "\t"; }
  / "v"  { return "\v"; }

NonEscapeCharacter
  = !(EscapeCharacter / LineTerminator) SourceCharacter { return text(); }

EscapeCharacter
  = SingleEscapeCharacter
  / DecimalDigit
  / "x"
  / "u"

HexEscapeSequence
  = "x" digits:$(HexDigit HexDigit) {
      return String.fromCharCode(parseInt(digits, 16));
    }

UnicodeEscapeSequence
  = "u" digits:$(HexDigit HexDigit HexDigit HexDigit) {
      return String.fromCharCode(parseInt(digits, 16));
    }

SourceCharacter
  = .
