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

const plain = (ast) => {
  const iter = (tree, curPath = []) => tree.map((elem) => {
    switch (elem.type) {
      case 'nested':
        return iter(elem.children, [...curPath, elem.name]);
      case 'modified':
        return `Property '${[...curPath, elem.name].join('.')}' was updated. From ${printValue(elem.oldValue)} to ${printValue(elem.newValue)}`;
      case 'deleted':
        return `Property '${[...curPath, elem.name].join('.')}' was removed`;
      case 'added':
        return `Property '${[...curPath, elem.name].join('.')}' was added with value: ${printValue(elem.newValue)}`;
      default:
        return null;
    }
  }).filter(filterEmptyString).join('\n');
  return iter(ast);
};

export default plain;
