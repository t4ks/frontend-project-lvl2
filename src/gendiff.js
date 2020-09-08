/* eslint-disable no-param-reassign */
import _ from 'lodash';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

export default (config1, config2, format = 'stylish') => {
  const configOld = parse(config1);
  const configNew = parse(config2);
  const formatter = getFormatter(format);

  const compare = (configBefore, configAfter) => {
    const keys = _.union(Object.keys(configBefore), Object.keys(configAfter)).sort();

    return keys.map((key) => {
      const newValue = configAfter[key];
      const oldValue = configBefore[key];

      if (newValue !== undefined && _.isPlainObject(oldValue) && _.isPlainObject(newValue)) {
        return { name: key, children: compare(oldValue, newValue) };
      }
      if (newValue === undefined) {
        return { name: key, type: 'deleted', value: { old: oldValue } };
      }
      if (oldValue === undefined) {
        return { name: key, type: 'added', value: { new: newValue } };
      }
      if (oldValue !== newValue) {
        return { name: key, type: 'modified', value: { old: oldValue, new: newValue } };
      }
      return { name: key, type: 'same', value: { old: oldValue, new: newValue } };
    });
  };

  const ast = compare(configOld, configNew);
  return `\n${formatter(ast)}\n`;
};
