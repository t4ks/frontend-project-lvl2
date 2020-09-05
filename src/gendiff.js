/* eslint-disable no-param-reassign */
import _ from 'lodash';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

export default (config1, config2, format = 'stylish') => {
  const configOld = parse(config1);
  const configNew = parse(config2);
  const formatter = getFormatter(format);

  const makeNode = (name, {
    type = null, oldValue = null, newValue = null, children = [],
  } = {}) => ({
    [null]: { name, children },
    deleted: { name, type, value: { old: oldValue } },
    modified: { name, type, value: { old: oldValue, new: newValue } },
    added: { name, type, value: { new: newValue } },
    same: { name, type, value: { old: oldValue, new: newValue } },
  }[type]);

  const compare = (configBefore, configAfter, result = []) => {
    Object.entries(configBefore).forEach((entry) => {
      const [key, oldValue] = entry;
      const newValue = configAfter[key];

      if (newValue !== undefined && _.isPlainObject(oldValue) && _.isPlainObject(newValue)) {
        result.push(makeNode(key));
        return compare(oldValue, newValue, _.last(result).children);
      }

      if (newValue === undefined) {
        result.push(makeNode(key, { type: 'deleted', oldValue }));
      } else if (oldValue !== newValue) {
        result.push(makeNode(key, { type: 'modified', oldValue, newValue }));
      } else if (oldValue === configAfter[key]) {
        result.push(makeNode(key, { type: 'same', oldValue, newValue }));
      }

      return result;
    });

    Object.entries(configAfter).filter((entry) => {
      const [key] = entry;
      return !_.has(configBefore, key);
    }).forEach((entry) => {
      const [key, newValue] = entry;
      return result.push(makeNode(key, { type: 'added', newValue }));
    });

    return result;
  };

  const inplaceSortByName = (obj) => {
    if (_.has(obj, 'children')) {
      obj.children = _.sortBy(obj.children, (o) => o.name);
      return obj.children.map(inplaceSortByName);
    }
    return obj;
  };
  const ast = compare(configOld, configNew);
  ast.map(inplaceSortByName);

  return `\n${formatter(ast)}\n`;
};
