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
    const renderRow = (symbol, value) => `${makeDepthIndent(depth)}  ${symbol} ${node.name}: ${makeRowNew(value, depth)}`;
    switch (node.type) {
      case 'nested':
        return `${makeDepthIndent(depth)}    ${node.name}: ${stylish(node.children, depth + 1)}`;
      case 'added':
        return renderRow(addSymbol, node.newValue);
      case 'deleted':
        return renderRow(delSymbol, node.oldValue);
      case 'modified':
        return [renderRow(delSymbol, node.oldValue), renderRow(addSymbol, node.newValue)];
      case 'same':
        return renderRow(' ', node.oldValue);
      default:
        throw new Error(`Unknown type=${node.type}`);
    }
  });
  return `{\n${res.join('\n')}\n${makeDepthIndent(depth)}}`;
};

export default stylish;
