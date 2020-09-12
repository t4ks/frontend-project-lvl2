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

const buildString = (elem) => {
  if (elem.type === 'modified') {
    return `was updated. From ${printValue(elem.oldValue)} to ${printValue(elem.newValue)}`;
  }

  if (elem.type === 'deleted') {
    return 'was removed';
  }

  if (elem.type === 'added') {
    return `was added with value: ${printValue(elem.newValue)}`;
  }

  return '';
};

const filterEmptyString = (s) => (s !== '');

const formatNode = (elem, curPath = []) => {
  if (elem.type === 'nested') {
    return elem.children.map((el) => formatNode(el, [...curPath, elem.name])).filter(filterEmptyString).join('\n');
  }

  const buildedString = buildString(elem);
  const res = buildedString !== '' ? `Property '${[...curPath, elem.name].join('.')}' ${buildedString}` : '';
  return res;
};

export default (ast) => ast.map((el) => formatNode(el)).filter(filterEmptyString).join('\n');
