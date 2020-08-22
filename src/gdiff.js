/* eslint-disable no-param-reassign */
import _ from 'lodash';
import parser from './parsers.js';

const stylish = (ast) => {
  const addSymbol = '+';
  const deleteSymbol = '-';
  const spaceSymbol = ' ';
  const emptySymbol = '';

  const makeIndent = (symbol) => (symbol === emptySymbol ? emptySymbol : `${symbol}${spaceSymbol}`);
  const makeDepthIndent = (symbol, indents, depth) => (
    symbol === emptySymbol
      ? `${spaceSymbol.repeat(Math.imul(indents, depth))}`
      : `${spaceSymbol.repeat(Math.imul(indents, depth) - 2)}`);

  const makeRow = (symbol, name, value, depth, indents) => {
    const indent = makeIndent(symbol);
    const depthIndents = makeDepthIndent(symbol, indents, depth);
    const key = `${depthIndents}${indent}${name}`;
    if (_.isPlainObject(value)) {
      return `${key}: {\n${Object.entries(value)
        .map((entry) => makeRow(emptySymbol, ...entry, depth + 1, indents))
        .join('')}${spaceSymbol.repeat(depthIndents.length + indent.length)}}\n`;
    }

    return `${key}: ${value}\n`;
  };

  const getSymbolType = (type) => {
    switch (type) {
      case 'added':
        return [addSymbol];
      case 'deleted':
        return [deleteSymbol];
      case 'modified':
        return [deleteSymbol, addSymbol];
      default:
        return [emptySymbol];
    }
  };

  const getValue = (symbol, value) => (symbol === addSymbol ? value.new : value.old);

  const formatNode = (node, depth, indents = 4) => {
    const type = _.get(node, 'type');
    const hasChilds = _.has(node, 'children');
    const depthIndents = spaceSymbol.repeat(indents * depth);
    const typeSymbols = getSymbolType(type);

    if (hasChilds) {
      return `${depthIndents}${node.name}: {\n${node.children.map((n) => formatNode(n, depth + 1, indents)).join('')}${depthIndents}}\n`;
    }

    return typeSymbols.map((s) => makeRow(s, node.name, getValue(s, node.value), depth, indents)).join('');
  };

  return `{\n${ast.map((a) => formatNode(a, 1)).join('')}}`;
};

export default (filepath1, filepath2) => {
  const f1 = parser(filepath1);
  const f2 = parser(filepath2);

  const iter = (acc, name, curPath2 = [], trails = new Set()) => {
    curPath2.push(name);
    const p = curPath2.join('/');
    if (trails.has(p)) {
      curPath2.pop();
      return acc;
    }
    trails.add(p);
    const node = { name };

    const valueFromFile1 = _.get(f1, curPath2);
    const valueFromFile2 = _.get(f2, curPath2);

    if ((_.isPlainObject(valueFromFile1)) && (_.isPlainObject(valueFromFile2))) {
      const curPath1 = [...curPath2];
      const children2 = Object
        .keys(valueFromFile2)
        .reduce((curAcc, item) => iter(curAcc, item, curPath2, trails), []);
      const children1 = Object
        .keys(valueFromFile1)
        .reduce((curAcc, item) => iter(curAcc, item, curPath1, trails), []);
      node.children = [...children2, ...children1];
      acc.push(node);
      return acc;
    }

    if (valueFromFile1 === undefined) {
      node.type = 'added';
    } else if (valueFromFile2 === undefined) {
      node.type = 'deleted';
    } else if (valueFromFile1 !== valueFromFile2) {
      node.type = 'modified';
    }

    node.value = {
      old: valueFromFile1,
      new: valueFromFile2,
    };

    acc.push(node);
    curPath2.pop();
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

  const inplaceSortByName = (obj) => {
    if (_.has(obj, 'children')) {
      obj.children = _.sortBy(obj.children, (o) => o.name);
      return obj.children.map(inplaceSortByName);
    }
    return obj;
  };
  const ast = _.sortBy(Object
    .keys(f2)
    .reduce((acc, key) => iter(acc, key), accum), (o) => o.name);

  ast.map(inplaceSortByName);
  return `\n${stylish(ast)}`;
};
