/* eslint-disable no-param-reassign */
import _ from 'lodash';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

export default (config1, config2, format = 'stylish') => {
  const configOld = parse(config1);
  const configNew = parse(config2);
  const formatter = getFormatter(format);

  const compare = (configBefore, configAfter, result = []) => {
    Object.entries(configBefore).forEach((entry) => {
      const [key, oldValue] = entry;
      const beforeValIsObject = _.isPlainObject(oldValue);
      const afterValIsObject = _.isPlainObject(configAfter[key]);
      const keyWasDeleted = !_.has(configAfter, key);

      if (!keyWasDeleted && beforeValIsObject && afterValIsObject) {
        const node = {
          name: key,
          children: [],
        };
        result.push(node);
        return compare(oldValue, configAfter[key], _.last(result).children);
      }
      if (keyWasDeleted) {
        return result.push(
          {
            name: key,
            type: 'deleted',
            value: {
              old: oldValue,
            },
          },
        );
      }
      if (oldValue !== configAfter[key]) {
        return result.push(
          {
            name: key,
            type: 'modified',
            value: {
              old: oldValue,
              new: configAfter[key],
            },
          },
        );
      }
      if (oldValue === configAfter[key]) {
        return result.push(
          {
            name: key,
            type: 'same',
            value: {
              old: oldValue,
              new: configAfter[key],
            },
          },
        );
      }

      return result;
    });

    Object.entries(configAfter).filter((entry) => {
      const [key] = entry;
      return !_.has(configBefore, key);
    }).forEach((entry) => {
      const [key, value] = entry;
      return result.push(
        {
          name: key,
          type: 'added',
          value: {
            new: value,
          },
        },
      );
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
