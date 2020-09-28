import _ from 'lodash';

const addSymbol = '+';
const deleteSymbol = '-';
const spaceSymbol = ' ';
const emptySymbol = '';
const indents = 4;

const makeIndent = (symbol) => (symbol === emptySymbol ? emptySymbol : `${symbol}${spaceSymbol}`);
const makeDepthIndent = (depth) => spaceSymbol.repeat(indents * depth);

const makeRow = (symbol, name, value, depth) => {
  const indent = makeIndent(symbol);
  const spaces = symbol === emptySymbol ? makeDepthIndent(depth) : makeDepthIndent(depth - 0.5);
  const key = `${spaces}${indent}${name}`;
  if (!_.isPlainObject(value)) {
    return `${key}: ${value}\n`;
  }

  return `${key}: {\n${Object.entries(value)
    .map((entry) => makeRow(emptySymbol, ...entry, depth + 1))
    .join('')}${spaceSymbol.repeat(spaces.length + indent.length)}}\n`;
};

const stylish = (ast) => {
  const iter = (tree, depth = 1) => tree.map((node) => {
    switch (node.type) {
      case 'nested':
        return `${makeDepthIndent(depth)}${node.name}: {\n${iter(node.children, depth + 1).join('')}${makeDepthIndent(depth)}}\n`;
      case 'added':
        return makeRow(addSymbol, node.name, node.newValue, depth);
      case 'deleted':
        return makeRow(deleteSymbol, node.name, node.oldValue, depth);
      case 'modified':
        return [
          makeRow(deleteSymbol, node.name, node.oldValue, depth),
          makeRow(addSymbol, node.name, node.newValue, depth),
        ].join('');
      case 'same':
        return makeRow(emptySymbol, node.name, node.oldValue, depth);
      default:
        throw new Error('Invalid type node');
    }
  });
  return `{\n${iter(ast).join('')}}`;
};

export default stylish;
