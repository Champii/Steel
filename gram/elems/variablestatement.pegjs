// VariableStatement
//   = VariableDeclarationList

// VariableDeclarationList
//   = VariableDeclaration (',' VariableDeclaration)*

// VariableDeclaration
//   = Identifier Initialiser?

// Initialiser
//   = ws '=' ws Assignable
//   // = '=' AssignmentExpression

// AssignmentExpression
//   = (LeftHandSideExpression AssignmentOperator AssignmentExpression)
//   / ConditionalExpression

// LeftHandSideExpression
//   = CallExpression
//   / NewExpression

// NewExpression
//   = MemberExpression
//   / ('new' NewExpression)

// CallExpression
//   = MemberExpression
//     Arguments
//     (
//       Arguments
//     / ('[' Expression ']')
//     / ('.' IdentifierName)
//     )*

// MemberExpression
//   = (
//       PrimaryExpression
//     / FunctionExpression
//     / ('new' MemberExpression Arguments)
//     )
//     (
//       ('[' Expression ']')
//     / ('.' IdentifierName)
//     )*

// PrimaryExpression
//   = 'this'
//   / Identifier
//   / Literal
//   / Array
//   / Object
//   / ('(' Expression ')')

// Arguments
//   = '('
//     (
//       AssignmentExpression
//       (',' AssignmentExpression)*
//     )?
//     ')'

// AssignmentOperator
//   = '='
//   / '*='
//   / '/='
//   / '%='
//   / '+='
//   / '-='
//   / '<<='
//   / '>>='
//   / '>>>='
//   / '&='
//   / '^='
//   / '|='

// ConditionalExpression
//   = LogicalORExpression
//     ('?' AssignmentExpression ':' AssignmentExpression)?

// LogicalORExpression
//   = LogicalANDExpression
//     ('||' LogicalANDExpression)*

// LogicalANDExpression
//   = BitwiseORExpression
//     ('&&' BitwiseORExpression)*

// BitwiseORExpression
//   = BitwiseXORExpression
//     ('|' BitwiseXORExpression)*

// BitwiseXORExpression
//   = BitwiseANDExpression
//     ('^' BitwiseANDExpression)*

// BitwiseANDExpression
//   = EqualityExpression
//     ('&' EqualityExpression)*

// EqualityExpression
//   = RelationalExpression
//     (('==' / '!=' / '===' / '!==') RelationalExpression)*

// RelationalExpression
//   = ShiftExpression
//     (( '<' / '>' / '<=' / '>=' / 'instanceof' / 'in') ShiftExpression)*

// ShiftExpression
//   = AdditiveExpression
//     (( '<<' / '>>' / '>>>') AdditiveExpression)*

// AdditiveExpression
//   = MultiplicativeExpression
//     (( '+' / '-') MultiplicativeExpression)*

// MultiplicativeExpression
//   = UnaryExpression
//     (( '*' / '/' / '%') UnaryExpression)*

// UnaryExpression
//   = PostfixExpression
//   / 'delete' UnaryExpression
//   / 'void' UnaryExpression
//   / 'typeof' UnaryExpression
//   / '++' UnaryExpression
//   / '--' UnaryExpression
//   / '+' UnaryExpression
//   / '-' UnaryExpression
//   / '~' UnaryExpression
//   / '!' UnaryExpression

// PostfixExpression
//   = LeftHandSideExpression
//     ( '++' / '--' )?
