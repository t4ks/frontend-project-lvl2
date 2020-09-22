import _ from 'lodash';

const printValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return value;
};

const filterEmptyString = (s) => (s !== null);
const buildPath = (pathSegments) => pathSegments.join('.');

const plain = (ast) => {
  const iter = (tree, curPath = []) => tree.map((elem) => {
    switch (elem.type) {
      case 'nested':
        return iter(elem.children, [...curPath, elem.name]);
      case 'modified':
        return `Property '${buildPath([...curPath, elem.name])}' was updated. From ${printValue(elem.oldValue)} to ${printValue(elem.newValue)}`;
      case 'deleted':
        return `Property '${buildPath([...curPath, elem.name])}' was removed`;
      case 'added':
        return `Property '${buildPath([...curPath, elem.name])}' was added with value: ${printValue(elem.newValue)}`;
      default:
        return null;
    }
  }).filter(filterEmptyString).join('\n');
  return iter(ast);
};

export default plain;
