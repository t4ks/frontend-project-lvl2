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
    switch (node.type) {
      case 'nested':
        return `${makeDepthIndent(depth)}    ${node.name}: ${stylish(node.children, depth + 1)}`;
      case 'added':
        return `${makeDepthIndent(depth)}  ${addSymbol} ${node.name}: ${makeRowNew(node.newValue, depth)}`;
      case 'deleted':
        return `${makeDepthIndent(depth)}  ${delSymbol} ${node.name}: ${makeRowNew(node.oldValue, depth)}`;
      case 'modified':
        return [
          `${makeDepthIndent(depth)}  ${delSymbol} ${node.name}: ${makeRowNew(node.oldValue, depth)}`,
          `${makeDepthIndent(depth)}  ${addSymbol} ${node.name}: ${makeRowNew(node.newValue, depth)}`,
        ];
      case 'same':
        return `${makeDepthIndent(depth)}    ${node.name}: ${makeRowNew(node.oldValue, depth)}`;
      default:
        throw new Error('Invalid type node');
    }
  });
  return `{\n${res.join('\n')}\n${makeDepthIndent(depth)}}`;
};

export default stylish;
