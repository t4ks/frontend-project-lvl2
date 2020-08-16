/* eslint-disable no-param-reassign */
import _ from 'lodash';
import parser from './parsers.js';


const textFormat = (parsedJSONs) => {
  const lines = parsedJSONs.reduce((acc, elem) => {
    switch (elem.type) {
      case 'modified':
        acc += `  - ${elem.key}: ${elem.value.old}\n  + ${elem.key}: ${elem.value.new}\n`;
        break;
      case 'deleted':
        acc += `  - ${elem.key}: ${elem.value.old}\n`;
        break;
      case 'added':
        acc += `  + ${elem.key}: ${elem.value.new}\n`;
        break;
      default:
        acc += `    ${elem.key}: ${elem.value.old}\n`;
    }
    return acc;
  }, '');
  return `\n{\n${lines}}`;
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
    const [name, value_from_f2] = entry;
    curPath.push(name);
    
    const node = {
      name: name,
    }

    const value_from_f1 = _.get(f1, curPath)

    if (( _.isPlainObject(value_from_f1)) && ( _.isPlainObject(value_from_f2)))  {
      node.children = Object.entries(value_from_f2).reduce((curAcc, entry) => iter(curAcc, entry, curPath), []);
      acc.push(node);
      return acc;
    }
    
    else if (value_from_f1 === undefined) {
      node.type = 'added';
    }


    else if (value_from_f1 !== value_from_f2) {
      node.type = 'modified'
    }

    node.value = {
      old: value_from_f1,
      new: value_from_f2,
    }

    acc.push(node);
    curPath.pop();
    return acc;
  }

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
    }
  });

  const ast = Object.entries(f2).reduce((acc, entry) => iter(acc, entry, []), accum);

  console.log('AST -> ', JSON.stringify(ast, null, 2));
};
