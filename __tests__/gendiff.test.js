/* eslint-disable no-undef */
import { fileURLToPath } from 'url';
import path from 'path';
import genDiff from '../src/gendiff';
import getFormatter from '../src/formatters/index.js';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
/* eslint-disable no-underscore-dangle */
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('diff yaml files stylish formatter', () => {
  expect(
    genDiff(
      path.resolve(getFixturePath('file1.yaml')),
      path.resolve(getFixturePath('file2.yaml')),
      getFormatter('stylish'),
    ),
  ).toEqual(`
{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: too much
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        fee: 100500
        deep: {
            id: {
                number: 45
            }
        }
    }
}
`);
});

test('diff yaml/json files 1 stylish formatter', () => {
  expect(
    genDiff(
      path.resolve(getFixturePath('file1.yaml')),
      path.resolve(getFixturePath('file2.json')),
      getFormatter('stylish'),
    ),
  ).toEqual(`
{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: too much
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        fee: 100500
        deep: {
            id: {
                number: 45
            }
        }
    }
}
`);
});

test('diff flat json two equals files stylish formatter', () => {
  expect(
    genDiff(
      path.resolve(getFixturePath('file1.json')),
      path.resolve(getFixturePath('file1.json')),
      getFormatter('stylish'),
    ),
  ).toEqual(`
{
    common: {
        setting1: Value 1
        setting2: 200
        setting3: true
        setting6: {
            doge: {
                wow: too much
            }
            key: value
        }
    }
    group1: {
        baz: bas
        foo: bar
        nest: {
            key: value
        }
    }
    group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
}
`);
});

test('diff jsons without extention stylish formatter', () => {
  expect(
    genDiff(
      path.resolve(getFixturePath('file1_1')),
      path.resolve(getFixturePath('file2.json')),
      getFormatter('stylish'),
    ),
  ).toEqual(`
{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: too much
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        fee: 100500
        deep: {
            id: {
                number: 45
            }
        }
    }
}
`);
});

test('diff inis stylish formatter', () => {
  expect(
    genDiff(
      path.resolve(getFixturePath('file1.ini')),
      path.resolve(getFixturePath('file2.ini')),
      getFormatter('stylish'),
    ),
  ).toEqual(`
{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: too much
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        fee: 100500
        deep: {
            id: {
                number: 45
            }
        }
    }
}
`);
});

test('diff jsons stylish formatter', () => {
  expect(
    genDiff(
      path.resolve(getFixturePath('file1.json')),
      path.resolve(getFixturePath('file2.json')),
      getFormatter('stylish'),
    ),
  ).toEqual(`
{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: too much
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        fee: 100500
        deep: {
            id: {
                number: 45
            }
        }
    }
}
`);
});

test('diff json configs with plain formatter', () => {
  expect(
    genDiff(
      path.resolve(getFixturePath('file1.json')),
      path.resolve(getFixturePath('file2.json')),
      getFormatter('plain'),
    ),
  ).toEqual(`
Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to [complex value]
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From 'too much' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]
`);
});

test('diff json configs with json formatter', () => {
  expect(
    genDiff(
      path.resolve(getFixturePath('file1.json')),
      path.resolve(getFixturePath('file2.json')),
      getFormatter('json'),
    ),
  ).toEqual(`
[
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
        "type": "same",
        "value": {
          "old": "Value 1",
          "new": "Value 1"
        }
      },
      {
        "name": "setting2",
        "type": "deleted",
        "value": {
          "old": 200
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
          },
          {
            "name": "key",
            "type": "same",
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
          }
        ]
      }
    ]
  },
  {
    "name": "group1",
    "children": [
      {
        "name": "baz",
        "type": "modified",
        "value": {
          "old": "bas",
          "new": "bars"
        }
      },
      {
        "name": "foo",
        "type": "same",
        "value": {
          "old": "bar",
          "new": "bar"
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
`);
});
