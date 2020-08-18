/* eslint-disable no-param-reassign */
import _ from 'lodash';
import parser from './parsers.js';

const stylish = (ast) => {
  const addSymbol = '+';
  const deleteSymbol = '-';

  const formatValue = (value) => {
    if (_.isPlainObject(value)) {
      return _.map(value, formatValue);
    }
    value
  }

  const buildRow = (indent, symbol, name, value) => {
    return `${indent}${symbol}${name}: ${value}`;
  }

  const makeRow = (item, type, depth) => {
    const indent = '  '.repeat(depth);
    if (type === 'modified') {
      return buildRow(indent, deleteSymbol, item.name, item.value.old).concat('\n', buildRow(indent, addSymbol, item.name, item.value.new));
    }
    if (type === 'deleted') {
      return `\n${buildRow(indent, deleteSymbol, item.name, item.value.old)}`;
    }
    if (type === 'added') {
      return `\n${buildRow(indent, addSymbol, item.name, item.value.new)}`;
    }
    return `\n${buildRow(indent, '', item.name, item.value.old)}`;
  };

  const normalize = (item, depth = 1) => {
    const type = _.get(item, 'type');
    if ((type === undefined) && _.has(item, 'children')) {
      return `${item.name}: \n${item.children.map((o) => normalize(o, depth + 1))}`;
    }
    return makeRow(item, type, depth);
  };

  return ast.map(normalize);
};


/* f1
{
  "common": {
    "setting1": "Value 1",
    "setting2": 200,
    "setting3": true,
    "setting6": {
      "key": "value",
      "doge": {
        "wow": "too much"
      }
    }
  },
  "group1": {
    "baz": "bas",
    "foo": "bar",
    "nest": {
      "key": "value"
    }
  },
  "group2": {
    "abc": 12345,
    "deep": {
      "id": 45
    }
  }
}

f2 

{
  "common": {
    "follow": false,
    "setting1": "Value 1",
    "setting3": {
      "key": "value"
    },
    "setting4": "blah blah",
    "setting5": {
      "key5": "value5"
    },
    "setting6": {
      "key": "value",
      "ops": "vops",
      "doge": {
        "wow": "so much"
      }
    }
  },

  "group1": {
    "foo": "bar",
    "baz": "bars",
    "nest": "str"
  },

  "group3": {
    "fee": 100500,
    "deep": {
      "id": {
        "number": 45
      }
    }
  }
}

ast 

[
  {
    name: "common",
    children: [
      {
        name: "follow",
        children: [],
        type: "deleted",
        value: false,
      },
      {
        name: "setting1",
        value: "Value 1",
        type: "same",
        children: [],
      },
      {
        name: "setting6",
        type: "modified",
        children: [
          {
            name: "doge",
            type: "modified",
            children: [
              {
                name: "wow",
                type: "modified",
                value: {
                  old: "too much",
                  new: "so much"
                }
              }
            ]
          }
        ],
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
  console.log('STYLISH -> ', stylish(ast));
};
