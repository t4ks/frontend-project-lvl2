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

const formatNode = (elem, curPath = []) => {
  switch (elem.type) {
    case 'nested':
      return elem.children.map((el) => formatNode(el, [...curPath, elem.name])).filter(filterEmptyString).join('\n');
    case 'modified':
      return `Property '${[...curPath, elem.name].join('.')}' was updated. From ${printValue(elem.oldValue)} to ${printValue(elem.newValue)}`;
    case 'deleted':
      return `Property '${[...curPath, elem.name].join('.')}' was removed`;
    case 'added':
      return `Property '${[...curPath, elem.name].join('.')}' was added with value: ${printValue(elem.newValue)}`;
    default:
      return null;
  }
};

export default (ast) => ast.map((el) => formatNode(el)).filter(filterEmptyString).join('\n');
