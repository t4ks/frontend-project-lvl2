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

const filterEmptyString = (s) => (s !== '');

const formatNode = (elem, curPath = []) => {
  if (elem.type === 'nested') {
    return elem.children.map((el) => formatNode(el, [...curPath, elem.name])).filter(filterEmptyString).join('\n');
  }

  if (elem.type === 'modified') {
    return `Property '${[...curPath, elem.name].join('.')}' was updated. From ${printValue(elem.oldValue)} to ${printValue(elem.newValue)}`;
  }

  if (elem.type === 'deleted') {
    return `Property '${[...curPath, elem.name].join('.')}' was removed`;
  }

  if (elem.type === 'added') {
    return `Property '${[...curPath, elem.name].join('.')}' was added with value: ${printValue(elem.newValue)}`;
  }

  return '';
};

export default (ast) => ast.map((el) => formatNode(el)).filter(filterEmptyString).join('\n');
