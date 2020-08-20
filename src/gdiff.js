/* eslint-disable no-param-reassign */
import _ from 'lodash';
import parser from './parsers.js';

const stylish = (ast) => {
  const addSymbol = '+';
  const deleteSymbol = '-';
  const space = ' ';

  const makeRow = (symbol, name, value, depth, indents) => {
    const indent = symbol === '' ? '' : `${symbol}${space}`;
    const depthIndents = indent === '' ? `${space.repeat(Math.imul(indents, depth))}` : `${space.repeat(Math.imul(indents, depth) - 2)}`;
    const key = `${depthIndents}${indent}${name}`;
    if (_.isPlainObject(value)) {
      return `${key}: {\n${Object.entries(value).map((entry) => makeRow('', ...entry, depth + 1, indents)).join('')}${space.repeat(depthIndents.length + indent.length)}}\n`;
    }

    return `${key}: ${value}\n`;
  };

  const getSymbolType = (type) => {
    switch (type) {
      case 'added':
        return [addSymbol];
      case 'deleted':
        return [deleteSymbol];
      case 'modified':
        return [addSymbol, deleteSymbol];
      default:
        return [''];
    }
  };

  const getValue = (symbol, value) => (symbol === addSymbol ? value.new : value.old);

  const formatNode = (node, depth, indents = 4) => {
    const type = _.get(node, 'type');
    const hasChilds = _.has(node, 'children');
    const depthIndents = space.repeat(indents * depth);
    const typeSymbols = getSymbolType(type);

    if (hasChilds) {
      return `${depthIndents}${node.name}: {\n${node.children.map((n) => formatNode(n, depth + 1, indents)).join('')}${depthIndents}}\n`;
    }

    return typeSymbols.map((s) => makeRow(s, node.name, getValue(s, node.value), depth, indents)).join('');
  };

  return `{\n${ast.map((a) => formatNode(a, 1)).join('')}}`;
};

/* 
['  - group2: {\n        abc: 12345\n        deep: {\n                id: 45\n        }\n                }\n']
[
  {
    "name": "group2",
    "type": "deleted",
    "value": {
      "old": {
        "abc": 12345,
        "deep": {
          "id": 45
        }
      }
    }
  },
  {
    "name": "common",
    "children": [
      {
        "name": "follow",
        "type": "added",
        "value": {
          "new": false
        }
      },
      {
        "name": "setting1",
        "value": {
          "old": "Value 1",
          "new": "Value 1"
        }
      },
      {
        "name": "setting3",
        "type": "modified",
        "value": {
          "old": true,
          "new": {
            "key": "value"
          }
        }
      },
      {
        "name": "setting4",
        "type": "added",
        "value": {
          "new": "blah blah"
        }
      },
      {
        "name": "setting5",
        "type": "added",
        "value": {
          "new": {
            "key5": "value5"
          }
        }
      },
      {
        "name": "setting6",
        "children": [
          {
            "name": "key",
            "value": {
              "old": "value",
              "new": "value"
            }
          },
          {
            "name": "ops",
            "type": "added",
            "value": {
              "new": "vops"
            }
          },
          {
            "name": "doge",
            "children": [
              {
                "name": "wow",
                "type": "modified",
                "value": {
                  "old": "too much",
                  "new": "so much"
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "group1",
    "children": [
      {
        "name": "foo",
        "value": {
          "old": "bar",
          "new": "bar"
        }
      },
      {
        "name": "baz",
        "type": "modified",
        "value": {
          "old": "bas",
          "new": "bars"
        }
      },
      {
        "name": "nest",
        "type": "modified",
        "value": {
          "old": {
            "key": "value"
          },
          "new": "str"
        }
      }
    ]
  },
  {
    "name": "group3",
    "type": "added",
    "value": {
      "new": {
        "fee": 100500,
        "deep": {
          "id": {
            "number": 45
          }
        }
      }
    }
  }
]

*/


export default (filepath1, filepath2) => {
  const f1 = parser(filepath1);
  const f2 = parser(filepath2);

  const iter = (acc, entry, curPath) => {
    const [name, valueFromFile2] = entry;
    curPath.push(name);

    const node = { name };

    const valueFromFile1 = _.get(f1, curPath);

    if ((_.isPlainObject(valueFromFile1)) && (_.isPlainObject(valueFromFile2))) {
      node.children = Object
        .entries(valueFromFile2)
        .reduce((curAcc, item) => iter(curAcc, item, curPath), []);
      acc.push(node);
      return acc;
    }

    if (valueFromFile1 === undefined) {
      node.type = 'added';
    } else if (valueFromFile1 !== valueFromFile2) {
      node.type = 'modified';
    }

    node.value = {
      old: valueFromFile1,
      new: valueFromFile2,
    };

    acc.push(node);
    curPath.pop();
    return acc;
  };

  const accum = Object.entries(f1)
    .filter((entry) => !_.has(f2, entry[0]))
    .map((entry) => {
      const [key, value] = entry;
      return {
        name: key,
        type: 'deleted',
        value: {
          old: value,
        },
      };
    });

  const ast = Object.entries(f2).reduce((acc, entry) => iter(acc, entry, []), accum);

  console.log('AST -> ', JSON.stringify(ast, null, 2));
  console.log(`STYLISH ->\n\n${stylish(ast)}`);
};
