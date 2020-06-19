"use strict";
import { TmLanguage } from "./TMLanguageModel";

const upperLetterChars = "A-Z\\p{Lt}\\p{Lu}"
const upperLetter = `[${upperLetterChars}]`
const lowerLetterChars = "_a-z\\$\\p{Lo}\\p{Nl}\\p{Ll}"
const lowerLetter = `[${lowerLetterChars}]`
const letterChars = `${upperLetterChars}${lowerLetterChars}`
const letter = `[${letterChars}]`
const letterOrDigitChars = `${letterChars}0-9`
const letterOrDigit = `[${letterOrDigitChars}]`
const alphaId = `${letter}+`
const letterOrDigitNoDollarSign = `[${letterOrDigit.replace("\\$", "")}]`
const simpleInterpolatedVariable  = `${letter}${letterOrDigitNoDollarSign}*` // see SIP-11 https://docs.clove-lang.org/sips/string-interpolation.html
const opchar = `[!#%&*+\\-\\/:<>=?@^|~\\p{Sm}\\p{So}]`
const idrest = `${letter}${letterOrDigit}*(?:(?<=_)${opchar}+)?`
const idUpper = `${upperLetter}${letterOrDigit}*(?:(?<=_)${opchar}+)?`
const idLower = `${lowerLetter}${letterOrDigit}*(?:(?<=_)${opchar}+)?`
const plainid = `(?:${idrest}|${opchar}+)`
const backQuotedId = "`[^`]+`"


export const cloveTmLanguage: TmLanguage = {
  fileTypes: [
    'clove'
  ],
  firstLineMatch: '^#!/.*\\b\\w*clove\\b',
  foldingStartMarker: '/\\*\\*|\\{\\s*$',
  foldingStopMarker: '\\*\\*/|^\\s*\\}',
  keyEquivalent: '^~S',
  repository: {
    'empty-parentheses': {
      match: '(\\(\\))',
      captures: {
        '1': {
          name: 'meta.bracket.clove'
        }
      },
      name: 'meta.parentheses.clove'
    },
    imports: {
      end: '(?<=[\\n;])',
      begin: '\\b(import)\\s+',
      beginCaptures: {
        '1': {
          name: 'keyword.other.import.clove'
        }
      },
      patterns: [
        {
          include: '#comments'
        },
        {
          match: `(given)(?=\\s)`,
          name: 'keyword.given.import.clove'
        },
        {
          match: `(${backQuotedId}|${plainid})`,
          name: 'entity.name.import.clove'
        },
        {
          match: '\\.',
          name: 'punctuation.definition.import'
        },
        {
          end: '}',
          begin: '{',
          beginCaptures: {
            '0': {
              name: 'meta.bracket.clove'
            }
          },
          patterns: [
            {
              match: `(?x)\\s*(${backQuotedId}|${plainid})\\s*(=>)\\s*(${backQuotedId}|${plainid})\\s*`,
              captures: {
                '1': {
                  name: 'entity.name.import.renamed-from.clove'
                },
                '2': {
                  name: 'keyword.other.arrow.clove'
                },
                '3': {
                  name: 'entity.name.import.renamed-to.clove'
                }
              }
            },
            {
              match: `(given)(\\s+${plainid})?(?=\\s*[,}])`,
              captures: {
                '1': {
                  name: 'keyword.given.import.clove'
                },
                '2': {
                  name: 'entity.name.type.import.clove'
                }
              }
            },
            {
              match: '([^\\s.,}]+)',
              name: 'entity.name.import.clove'
            }
          ],
          endCaptures: {
            '0': {
              name: 'meta.bracket.clove'
            }
          },
          name: 'meta.import.selector.clove'
        }
      ],
      name: 'meta.import.clove'
    },
    constants: {
      patterns: [
        {
          match: '\\b(false|null|true)\\b',
          name: 'constant.language.clove'
        },
        {
          match: '\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\.[0-9]+)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?|[0-9]+)([LlFfDd]|UL|ul)?\\b',
          name: 'constant.numeric.clove'
        },
        {
          match: '\\b(this|super)\\b',
          name: 'variable.language.clove'
        }
      ]
    },
    'script-header': {
      match: '^#!(.*)$',
      captures: {
        '1': {
          name: 'string.unquoted.shebang.clove'
        }
      },
      name: 'comment.block.shebang.clove'
    },
    code: {
      patterns: [
        {
          include: '#script-header'
        },
        {
          include: '#storage-modifiers'
        },
        {
          include: '#declarations'
        },
        {
          include: '#inheritance'
        },
        {
          include: '#imports'
        },
        {
          include: '#comments'
        },
        {
          include: '#strings'
        },
        {
          include: '#initialization'
        },
        {
          include: '#xml-literal'
        },
        {
          include: '#keywords'
        },
        {
          include: '#constants'
        },
        {
          include: '#clove-symbol'
        },
        {
          include: '#clove-quoted'
        },
        {
          include: '#char-literal'
        },
        {
          include: '#empty-parentheses'
        },
        {
          include: '#parameter-list'
        },
        {
          include: '#qualifiedClassName'
        },
        {
          include: '#backQuotedVariable'
        },
        {
          include: '#curly-braces'
        },
        {
          include: '#meta-brackets'
        },
        {
          include: '#meta-bounds'
        },
        {
          include: '#meta-colons'
        }
      ]
    },
    strings: {
      patterns: [
        {
          end: '"""(?!")',
          begin: '"""',
          beginCaptures: {
            '0': {
              name: 'punctuation.definition.string.begin.clove'
            }
          },
          patterns: [
            {
              match: '\\\\\\\\|\\\\u[0-9A-Fa-f]{4}',
              name: 'constant.character.escape.clove'
            }
          ],
          endCaptures: {
            '0': {
              name: 'punctuation.definition.string.end.clove'
            }
          },
          name: 'string.quoted.triple.clove'
        },
        {
          begin: `\\b(${alphaId})(""")`,
          end: '"""(?!")',
          beginCaptures: {
            '1': {
              name: 'keyword.interpolation.clove'
            },
            '2': {
              name: 'string.quoted.triple.interpolated.clove punctuation.definition.string.begin.clove'
            }
          },
          patterns: [
            {
              "include": "#string-interpolation"
            },
            {
              match: '\\\\\\\\|\\\\u[0-9A-Fa-f]{4}',
              name: 'constant.character.escape.clove'
            },
            {
              match: '.',
              name: 'string.quoted.triple.interpolated.clove'
            }
          ],
          endCaptures: {
            '0': {
              name: 'string.quoted.triple.interpolated.clove punctuation.definition.string.end.clove'
            }
          }
        },
        {
          end: '"',
          begin: '"',
          beginCaptures: {
            '0': {
              name: 'punctuation.definition.string.begin.clove'
            }
          },
          patterns: [
            {
              match: `\\\\(?:[btnfr\\\\"']|[0-7]{1,3}|u[0-9A-Fa-f]{4})`,
              name: 'constant.character.escape.clove'
            },
            {
              match: '\\\\.',
              name: 'invalid.illegal.unrecognized-string-escape.clove'
            }
          ],
          endCaptures: {
            '0': {
              name: 'punctuation.definition.string.end.clove'
            }
          },
          name: 'string.quoted.double.clove'
        },
        {
          begin: `\\b(${alphaId})(")`,
          end: '"',
          beginCaptures: {
            '1': {
              name: 'keyword.interpolation.clove'
            },
            '2': {
              name: 'string.quoted.double.interpolated.clove punctuation.definition.string.begin.clove'
            }
          },
          patterns: [
            {
              include: "#string-interpolation"
            },
            {
              match: `\\\\(?:[btnfr\\\\"']|[0-7]{1,3}|u[0-9A-Fa-f]{4})`,
              name: 'constant.character.escape.clove'
            },
            {
              match: '\\\\.',
              name: 'invalid.illegal.unrecognized-string-escape.clove'
            },
            {
              match: '.',
              name: 'string.quoted.double.interpolated.clove'
            }
          ],
          endCaptures: {
            '0': {
              name: 'string.quoted.double.interpolated.clove punctuation.definition.string.end.clove'
            }
          }
        }
      ]
    },
    'string-interpolation': {
      patterns: [
        {
          name: "constant.character.escape.interpolation.clove",
          match: "\\$\\$"
        },
        {
          name: "meta.template.expression.clove",
          match: `(\\$)(${simpleInterpolatedVariable})`,
          captures: {
            "1": {
              name: "punctuation.definition.template-expression.begin.clove"
            }
          }
        },
        {
            name: "meta.template.expression.clove",
            begin: "\\$\\{",
            beginCaptures: { "0": { name: "punctuation.definition.template-expression.begin.clove" } },
            end: "\\}",
            endCaptures: { "0": { name: "punctuation.definition.template-expression.end.clove" } },
            patterns: [
                {
                    include: "#code"
                }
            ],
            contentName: "meta.embedded.line.clove"
        }
      ]
    },
    'xml-entity': {
      match: '(&)([:a-zA-Z_][:a-zA-Z0-9_.-]*|#[0-9]+|#x[0-9a-fA-F]+)(;)',
      captures: {
        '1': {
          name: 'punctuation.definition.constant.xml'
        },
        '3': {
          name: 'punctuation.definition.constant.xml'
        }
      },
      name: 'constant.character.entity.xml'
    },
    'xml-singlequotedString': {
      end: "'",
      begin: "'",
      beginCaptures: {
        '0': {
          name: 'punctuation.definition.string.begin.xml'
        }
      },
      patterns: [
        {
          include: '#xml-entity'
        }
      ],
      endCaptures: {
        '0': {
          name: 'punctuation.definition.string.end.xml'
        }
      },
      name: 'string.quoted.single.xml'
    },
    'meta-colons': {
      patterns: [
        {
          match: '(?<!:):(?!:)',
          name: 'meta.colon.clove'
        }
      ],
      comment: 'For themes: Matching type colons'
    },
    keywords: {
      patterns: [
        {
          match: '\\b(return|throw)\\b',
          name: 'keyword.control.flow.jump.clove'
        },
        {
          match: '\\b(classOf|isInstanceOf|asInstanceOf)\\b',
          name: 'support.function.type-of.clove'
        },
        {
          match: '\\b(else|if|then|do|while|for|yield|match|case)\\b',
          name: 'keyword.control.flow.clove'
        },
        {
          match: `^\\s*end(?=\\s+(if|while|for|match|${plainid})\\s*(//.*|/\\*(?!.*\\*/\\s*\\S.*).*)?$)`,
          name: 'keyword.control.flow.end.clove'
        },
        {
          match: '\\b(catch|finally|try)\\b',
          name: 'keyword.control.exception.clove'
        },
        {
          match: '(==?|!=|<=|>=|<>|<|>)',
          name: 'keyword.operator.comparison.clove'
        },
        {
          match: '(\\-|\\+|\\*|/(?![/*])|%|~)',
          name: 'keyword.operator.arithmetic.clove'
        },
        {
          match: '(!|&&|\\|\\|)',
          name: 'keyword.operator.logical.clove'
        },
        {
          match: '(<-|←|->|→|=>|⇒|\\?|\\:+|@|\\|)+',
          name: 'keyword.operator.clove'
        }
      ]
    },
    'clove-quoted': {
      match: "('\\{|'\\[)(?!')",
      name: 'constant.other.quoted.clove'
    },
    'xml-doublequotedString': {
      end: '"',
      begin: '"',
      beginCaptures: {
        '0': {
          name: 'punctuation.definition.string.begin.xml'
        }
      },
      patterns: [
        {
          include: '#xml-entity'
        }
      ],
      endCaptures: {
        '0': {
          name: 'punctuation.definition.string.end.xml'
        }
      },
      name: 'string.quoted.double.xml'
    },
    declarations: {
      patterns: [
        {
          match: `(?x)\\b(def)\\s+(${backQuotedId}|${plainid})`,
          captures: {
            '1': {
              name: 'keyword.declaration.clove'
            },
            '2': {
              name: 'entity.name.function.declaration'
            }
          }
        },
        {
          match: '\\b(trait)\\s+([^\\s\\{\\(\\[]+)',
          captures: {
            '1': {
              name: 'keyword.declaration.clove'
            },
            '2': {
              name: 'entity.name.class.declaration'
            }
          }
        },
        {
          match: '\\b(?:(case)\\s+)?(class|object)\\s+([^\\s\\{\\(\\[]+)',
          captures: {
            '1': {
              name: 'keyword.declaration.clove'
            },
            '2': {
              name: 'keyword.declaration.clove'
            },
            '3': {
              name: 'entity.name.class.declaration'
            }
          }
        },
        {
          match: `\\b(type)\\s+(${backQuotedId}|${plainid})`,
          captures: {
            '1': {
              name: 'keyword.declaration.clove'
            },
            '2': {
              name: 'entity.name.type.declaration'
            }
          }
        },
        {
          match: `\\b(val)\\s+(${idUpper}(\\s*,\\s*${idUpper})*)\\b`,
          captures: {
            '1': {
              name: 'keyword.declaration.stable.clove'
            }
            ,
            '2': {
              name: 'constant.other.declaration.clove'
            }
          }
        },
        {
          match: `\\b(?:(val)|(var))\\s+(?:(${backQuotedId}|${plainid})|(?=\\())`,
          captures: {
            '1': {
              name: 'keyword.declaration.stable.clove'
            },
            '2': {
              name: 'keyword.declaration.volatile.clove'
            },
            '3': {
              name: 'variable.other.declaration.clove'
            }
          }
        },
        {
          match: '\\b(package)\\s+(object)\\s+([^\\s\\{\\(\\[]+)',
          captures: {
            '1': {
              name: 'keyword.other.scoping.clove'
            },
            '2': {
              name: 'keyword.declaration.clove'
            },
            '3': {
              name: 'entity.name.class.declaration'
            }
          }
        },
        {
          end: '(?<=[\\n;])',
          begin: '\\b(package)\\s+',
          beginCaptures: {
            '1': {
              name: 'keyword.other.import.clove'
            }
          },
          patterns: [
            {
              include: '#comments'
            },
            {
              match: `(${backQuotedId}|${plainid})`,
              name: 'entity.name.package.clove'
            },
            {
              match: '\\.',
              name: 'punctuation.definition.package'
            }
          ],
          name: 'meta.package.clove'
        }
      ]
    },
    'char-literal': {
      end: "'|$",
      begin: "'",
      beginCaptures: {
        '0': {
          name: 'punctuation.definition.character.begin.clove'
        }
      },
      patterns: [
        {
          match: `\\\\(?:[btnfr\\\\"']|[0-7]{1,3}|u[0-9A-Fa-f]{4})`,
          name: 'constant.character.escape.clove'
        },
        {
          match: '\\\\.',
          name: 'invalid.illegal.unrecognized-character-escape.clove'
        },
        {
          match: "[^']{2,}",
          name: 'invalid.illegal.character-literal-too-long'
        },
        {
          match: "(?<!')[^']",
          name: 'invalid.illegal.character-literal-too-long'
        }
      ],
      endCaptures: {
        '0': {
          name: 'punctuation.definition.character.end.clove'
        }
      },
      name: 'string.quoted.other constant.character.literal.clove'
    },
    initialization: {
      match: '\\b(new)\\s+([^\\s,\\{\\}\\(\\)\\[\\]]+)',
      captures: {
        '1': {
          name: 'keyword.declaration.clove'
        },
        '2': {
          name: 'entity.name.class'
        }
      }
    },
    'clove-symbol': {
      match: `(?>'${plainid})(?!')`,
      name: 'constant.other.symbol.clove'
    },
    'curly-braces': {
      begin: '\\{',
      end: '\\}',
      beginCaptures: {
        '0': {
          name: 'punctuation.section.block.begin.clove'
        }
      },
      endCaptures: {
        '0': {
          name: 'punctuation.section.block.end.clove'
        }
      },
      patterns: [
        {
          include: '#code'
        }
      ]
    },
    'meta-brackets': {
      patterns: [
        {
          match: '\\{',
          comment: 'The punctuation.section.*.begin is needed for return snippet in source bundle',
          name: 'punctuation.section.block.begin.clove'
        },
        {
          match: '\\}',
          comment: 'The punctuation.section.*.end is needed for return snippet in source bundle',
          name: 'punctuation.section.block.end.clove'
        },
        {
          match: '{|}|\\(|\\)|\\[|\\]',
          name: 'meta.bracket.clove'
        }
      ],
      comment: 'For themes: Brackets look nice when colored.'
    },
    qualifiedClassName: {
      match: '(\\b([A-Z][\\w]*))',
      captures: {
        '1': {
          name: 'entity.name.class'
        }
      }
    },
    backQuotedVariable: {
      // capture back quoted variables in code so special symbols inside them do not
      // interfere with the rest of the rules. But don't assign any extra scope, to make them
      // consistent with the rest of variables
      match: `${backQuotedId}`
    },
    'storage-modifiers': {
      patterns: [
        {
          match: '\\b(private\\[\\S+\\]|protected\\[\\S+\\]|private|protected)\\b',
          name: 'storage.modifier.access'
        },
        {
          match: '\\b(synchronized|@volatile|abstract|final|lazy|sealed|implicit|given|enum|inline |opaque |override|@transient|@native)\\b',
          name: 'storage.modifier.other'
        }
      ]
    },
    'meta-bounds': {
      match: '<%|=:=|<:<|<%<|>:|<:',
      comment: 'For themes: Matching view bounds',
      name: 'meta.bounds.clove'
    },
    comments: {
      patterns: [
        {
          "include": "#block-comments"
        },
        {
          end: '(?!\\G)',
          begin: '(^[ \\t]+)?(?=//)',
          beginCaptures: {
            '1': {
              name: 'punctuation.whitespace.comment.leading.clove'
            }
          },
          patterns: [
            {
              end: '\\n',
              begin: '//',
              beginCaptures: {
                '0': {
                  name: 'punctuation.definition.comment.clove'
                }
              },
              name: 'comment.line.double-slash.clove'
            }
          ]
        }
      ]
    },
    'block-comments': {
      patterns: [
        {
          match: '/\\*\\*/',
          captures: {
            '0': {
              name: 'punctuation.definition.comment.clove'
            }
          },
          name: 'comment.block.empty.clove'
        },
        {
          end: '\\*/',
          begin: '^\\s*(/\\*\\*)(?!/)',
          beginCaptures: {
            '1': {
              name: 'punctuation.definition.comment.clove'
            }
          },
          patterns: [
            {
              match: '(@param)\\s+(\\S+)',
              captures: {
                '1': {
                  name: 'keyword.other.documentation.clovedoc.clove'
                },
                '2': {
                  name: 'variable.parameter.clove'
                }
              }
            },
            {
              match: '(@(?:tparam|throws))\\s+(\\S+)',
              captures: {
                '1': {
                  name: 'keyword.other.documentation.clovedoc.clove'
                },
                '2': {
                  name: 'entity.name.class'
                }
              }
            },
            {
              match: '@(return|see|note|example|constructor|usecase|author|version|since|todo|deprecated|migration|define|inheritdoc)\\b',
              name: 'keyword.other.documentation.clovedoc.clove'
            },
            {
              match: '(\\[\\[)([^\\]]+)(\\]\\])',
              captures: {
                '1': {
                  name: 'punctuation.definition.documentation.link.clove'
                },
                '2': {
                  name: 'string.other.link.title.markdown'
                },
                '3': {
                  name: 'punctuation.definition.documentation.link.clove'
                }
              }
            },
            {
              "include": "#block-comments"
            }
          ],
          endCaptures: {
            '0': {
              name: 'punctuation.definition.comment.clove'
            }
          },
          name: 'comment.block.documentation.clove'
        },
        {
          end: '\\*/',
          begin: '/\\*',
          captures: {
            '0': {
              name: 'punctuation.definition.comment.clove'
            }
          },
          patterns: [
            {
              "include": "#block-comments"
            }
          ],
          name: 'comment.block.clove'
        },
      ]
    },
    'xml-embedded-content': {
      patterns: [
        {
          end: '}',
          begin: '{',
          patterns: [
            {
              include: '#code'
            }
          ],
          captures: {
            '0': {
              name: 'meta.bracket.clove'
            }
          },
          name: 'meta.source.embedded.clove'
        },
        {
          match: ' (?:([-_a-zA-Z0-9]+)((:)))?([_a-zA-Z-]+)=',
          captures: {
            '1': {
              name: 'entity.other.attribute-name.namespace.xml'
            },
            '2': {
              name: 'entity.other.attribute-name.xml'
            },
            '3': {
              name: 'punctuation.separator.namespace.xml'
            },
            '4': {
              name: 'entity.other.attribute-name.localname.xml'
            }
          }
        },
        {
          include: '#xml-doublequotedString'
        },
        {
          include: '#xml-singlequotedString'
        }
      ]
    },
    inheritance: {
      patterns: [
        {
          match: '(extends|with|derives)\\s+([^\\s\\{\\[\\]]+)',
          captures: {
            '1': {
              name: 'keyword.declaration.clove'
            },
            '2': {
              name: 'entity.other.inherited-class.clove'
            }
          }
        }
      ]
    },
    'parameter-list': {
      patterns: [
        {
          match: `(?<=[^\\._$a-zA-Z0-9])(${backQuotedId}|${idLower})\\s*(:)\\s+`,
          captures: {
            '1': {
              name: 'variable.parameter.clove'
            },
            '2': {
              name: 'meta.colon.clove'
            }
          }
        }
      ]
    },
    'xml-literal': {
      patterns: [
        {
          end: '(>(<))/(?:([-_a-zA-Z0-9]+)((:)))?([-_a-zA-Z0-9:]*[_a-zA-Z0-9])(>)',
          begin: '(<)((?:([_a-zA-Z0-9][_a-zA-Z0-9]*)((:)))?([_a-zA-Z0-9][-_a-zA-Z0-9:]*))(?=(\\s[^>]*)?></\\2>)',
          beginCaptures: {
            '1': {
              name: 'punctuation.definition.tag.xml'
            },
            '3': {
              name: 'entity.name.tag.namespace.xml'
            },
            '4': {
              name: 'entity.name.tag.xml'
            },
            '5': {
              name: 'punctuation.separator.namespace.xml'
            },
            '6': {
              name: 'entity.name.tag.localname.xml'
            }
          },
          patterns: [
            {
              include: '#xml-embedded-content'
            }
          ],
          comment: 'We do not allow a tag name to start with a - since this would likely conflict with the <- operator. This is not very common for tag names anyway.  Also code such as -- if (val <val2 || val> val3) will falsly be recognized as an xml tag.  The solution is to put a space on either side of the comparison operator',
          endCaptures: {
            '1': {
              name: 'punctuation.definition.tag.xml'
            },
            '2': {
              name: 'meta.scope.between-tag-pair.xml'
            },
            '3': {
              name: 'entity.name.tag.namespace.xml'
            },
            '4': {
              name: 'entity.name.tag.xml'
            },
            '5': {
              name: 'punctuation.separator.namespace.xml'
            },
            '6': {
              name: 'entity.name.tag.localname.xml'
            },
            '7': {
              name: 'punctuation.definition.tag.xml'
            }
          },
          name: 'meta.tag.no-content.xml'
        },
        {
          end: '(/?>)',
          begin: '(</?)(?:([_a-zA-Z0-9][-_a-zA-Z0-9]*)((:)))?([_a-zA-Z0-9][-_a-zA-Z0-9:]*)(?=[^>]*?>)',
          patterns: [
            {
              include: '#xml-embedded-content'
            }
          ],
          captures: {
            '1': {
              name: 'punctuation.definition.tag.xml'
            },
            '2': {
              name: 'entity.name.tag.namespace.xml'
            },
            '3': {
              name: 'entity.name.tag.xml'
            },
            '4': {
              name: 'punctuation.separator.namespace.xml'
            },
            '5': {
              name: 'entity.name.tag.localname.xml'
            }
          },
          name: 'meta.tag.xml'
        },
        {
          include: '#xml-entity'
        }
      ]
    }
  },
  uuid: '158C0929-299A-40C8-8D89-316BE0C446E8',
  patterns: [
    {
      include: '#code'
    }
  ],
  name: 'clove',
  scopeName: 'source.clove'
}
