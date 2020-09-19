import _ from 'lodash';

const addSymbol = '+';
const deleteSymbol = '-';
const spaceSymbol = ' ';
const emptySymbol = '';

const makeIndent = (symbol) => (symbol === emptySymbol ? emptySymbol : `${symbol}${spaceSymbol}`);

const makeDepthIndent = (symbol, depth, indents) => (
  symbol === emptySymbol
    ? `${spaceSymbol.repeat(Math.imul(indents, depth))}`
    : `${spaceSymbol.repeat(Math.imul(indents, depth) - 2)}`);

const makeRow = (symbol, name, value, depth, indents) => {
  const indent = makeIndent(symbol);
  const depthIndents = makeDepthIndent(symbol, depth, indents);
  const key = `${depthIndents}${indent}${name}`;
  if (_.isPlainObject(value)) {
    return `${key}: {\n${Object.entries(value)
      .map((entry) => makeRow(emptySymbol, ...entry, depth + 1, indents))
      .join('')}${spaceSymbol.repeat(depthIndents.length + indent.length)}}\n`;
  }

  return `${key}: ${value}\n`;
};

const formatNode = (node, depth = 1, indents = 4) => {
  const depthIndents = spaceSymbol.repeat(indents * depth);
  switch (node.type) {
    case 'nested':
      return `${depthIndents}${node.name}: {\n${node.children.map((n) => formatNode(n, depth + 1, indents)).join('')}${depthIndents}}\n`;
    case 'added':
      return makeRow(addSymbol, node.name, node.newValue, depth, indents);
    case 'deleted':
      return makeRow(deleteSymbol, node.name, node.oldValue, depth, indents);
    case 'modified':
      return [
        makeRow(deleteSymbol, node.name, node.oldValue, depth, indents),
        makeRow(addSymbol, node.name, node.newValue, depth, indents),
      ].join('');
    default:
      return makeRow(emptySymbol, node.name, node.oldValue, depth, indents);
  }
};

export default (ast) => `{\n${ast.map((a) => formatNode(a)).join('')}}`;
