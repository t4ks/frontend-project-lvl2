/* eslint-disable no-param-reassign */
import _ from 'lodash';
import parser from './parsers.js';

export default (filepath1, filepath2, formatter) => {
  const f1 = parser(filepath1);
  const f2 = parser(filepath2);

  const getType = (value1, value2) => {
    if (value1 === undefined) {
      return 'added';
    }

    if (value2 === undefined) {
      return 'deleted';
    }

    if (value1 !== value2) {
      return 'modified';
    }

    return 'same';
  };

  const getDeletedRootKeys = (file1, file2) => (Object
    .entries(file1)
    .filter((entry) => !_.has(file2, entry[0]))
    .map((entry) => {
      const [key, value] = entry;
      return {
        name: key,
        type: 'deleted',
        value: {
          old: value,
        },
      };
    }));

  const prepareValues = (value1, value2) => ({ old: value1, new: value2 });

  const completeNode = (node, value1, value2) => {
    node.type = getType(value1, value2);
    node.value = prepareValues(value1, value2);
    return node;
  };

  const iter = (acc, name, curPath2 = [], trails = new Set()) => {
    const fullPath = [...curPath2, name];
    if (trails.has(fullPath.join('/'))) {
      return acc;
    }
    trails.add(fullPath.join('/'));
    const node = { name };
    const valueFromFile1 = _.get(f1, fullPath);
    const valueFromFile2 = _.get(f2, fullPath);

    if ((_.isPlainObject(valueFromFile1)) && (_.isPlainObject(valueFromFile2))) {
      const curPath1 = [...fullPath];
      node.children = [...Object
        .keys(valueFromFile2)
        .reduce((curAcc, item) => iter(curAcc, item, [...fullPath], trails), []), ...Object
        .keys(valueFromFile1)
        .reduce((curAcc, item) => iter(curAcc, item, curPath1, trails), [])];
      acc.push(node);
      return acc;
    }

    acc.push(completeNode(node, valueFromFile1, valueFromFile2));
    return acc;
  };

  const inplaceSortByName = (obj) => {
    if (_.has(obj, 'children')) {
      obj.children = _.sortBy(obj.children, (o) => o.name);
      return obj.children.map(inplaceSortByName);
    }
    return obj;
  };
  const ast = _.sortBy(Object
    .keys(f2)
    .reduce((acc, key) => iter(acc, key), getDeletedRootKeys(f1, f2)), (o) => o.name);

  ast.map(inplaceSortByName);
  return `\n${formatter(ast)}\n`;
};
