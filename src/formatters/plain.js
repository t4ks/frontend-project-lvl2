import _ from 'lodash';

const buildString = (elem) => {
  if (elem.type === 'modified') {
    return `was updated. From ${elem.value.old} to ${elem.value.new}`;
  }

  if (elem.type === 'deleted') {
    return 'was removed';
  }

  if (elem.type === 'added') {
    return `was added with value: '${elem.value.new}'`;
  }

  return '';
};

const formatNode = (elem, curPath = []) => {
  if (_.has(elem, 'children')) {
    curPath.push(elem.name);
    return elem.children.map((el) => formatNode(el, curPath)).join('||||');
  }
  curPath.push(elem.name);
  const buildedString = buildString(elem);
  const res = buildedString !== '' ? `Property '${curPath.join('.')}' ${buildedString}` : '';
  curPath.pop();
  console.log(`RES=${res}`);
  return res;
};

export default (ast) => {
  const a = ast.map((el) => formatNode(el));
  console.log('A -> ', a);
  console.log('FILTERED -> ', a.filter((s) => s !== '' || s !== '\n'));
};
