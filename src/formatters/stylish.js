import _ from 'lodash';

const indents = 2;
const delSymbol = '-';
const addSymbol = '+';

const makeDepthIndent = (depth) => '  '.repeat(indents * depth);

const makeRowNew = (value, depth) => {
  if (!_.isPlainObject(value)) {
    return value;
  }

  const lines = Object.keys(value).map((key) => `${makeDepthIndent(depth + 1)}    ${key}: ${makeRowNew(value[key], depth + 1)}`).join('\n');
  return `{\n${lines}\n${makeDepthIndent(depth + 1)}}`;
};

const stylish = (ast, depth = 0) => {
  const res = ast.flatMap((node) => {
    const printRow = (symbol, value) => `${makeDepthIndent(depth)}  ${symbol} ${node.name}: ${makeRowNew(value, depth)}`;
    switch (node.type) {
      case 'nested':
        return `${makeDepthIndent(depth)}    ${node.name}: ${stylish(node.children, depth + 1)}`;
      case 'added':
        return printRow(addSymbol, node.newValue);
      case 'deleted':
        return printRow(delSymbol, node.oldValue);
      case 'modified':
        return [printRow(delSymbol, node.oldValue), printRow(addSymbol, node.newValue)];
      case 'same':
        return printRow(' ', node.oldValue);
      default:
        throw new Error(`Unknown type=${node.type}`);
    }
  });
  return `{\n${res.join('\n')}\n${makeDepthIndent(depth)}}`;
};

export default stylish;
