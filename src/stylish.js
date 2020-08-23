import _ from 'lodash';

const ADDED_SYMBOL = '+';
const DELETED_SYMBOL = '-';
const SPACE_SYMBOL = ' ';
const EMPTY_SYMBOL = '';

const makeIndent = (symbol) => (symbol === EMPTY_SYMBOL ? EMPTY_SYMBOL : `${symbol}${SPACE_SYMBOL}`);

const makeDepthIndent = (symbol, indents, depth) => (
  symbol === EMPTY_SYMBOL
    ? `${SPACE_SYMBOL.repeat(Math.imul(indents, depth))}`
    : `${SPACE_SYMBOL.repeat(Math.imul(indents, depth) - 2)}`);

const makeRow = (symbol, name, value, depth, indents) => {
  const indent = makeIndent(symbol);
  const depthIndents = makeDepthIndent(symbol, indents, depth);
  const key = `${depthIndents}${indent}${name}`;
  if (_.isPlainObject(value)) {
    return `${key}: {\n${Object.entries(value)
      .map((entry) => makeRow(EMPTY_SYMBOL, ...entry, depth + 1, indents))
      .join('')}${SPACE_SYMBOL.repeat(depthIndents.length + indent.length)}}\n`;
  }

  return `${key}: ${value}\n`;
};

const getSymbolType = (type) => {
  switch (type) {
    case 'added':
      return [ADDED_SYMBOL];
    case 'deleted':
      return [DELETED_SYMBOL];
    case 'modified':
      return [DELETED_SYMBOL, ADDED_SYMBOL];
    default:
      return [EMPTY_SYMBOL];
  }
};

const getValue = (symbol, value) => (symbol === ADDED_SYMBOL ? value.new : value.old);

export default (ast) => {
  const formatNode = (node, depth, indents = 4) => {
    const type = _.get(node, 'type');
    const hasChilds = _.has(node, 'children');
    const depthIndents = SPACE_SYMBOL.repeat(indents * depth);
    const typeSymbols = getSymbolType(type);

    if (hasChilds) {
      return `${depthIndents}${node.name}: {\n${node.children.map((n) => formatNode(n, depth + 1, indents)).join('')}${depthIndents}}\n`;
    }

    return typeSymbols.map((s) => makeRow(s, node.name, getValue(s, node.value), depth, indents)).join('');
  };

  return `{\n${ast.map((a) => formatNode(a, 1)).join('')}}`;
};
