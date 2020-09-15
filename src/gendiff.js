/* eslint-disable no-param-reassign */
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

const compare = (configBefore, configAfter) => {
  const keys = _.union(Object.keys(configBefore), Object.keys(configAfter)).sort();

  return keys.map((key) => {
    const newValue = configAfter[key];
    const oldValue = configBefore[key];

    if (!_.has(configAfter, key)) {
      return { name: key, type: 'deleted', oldValue };
    }
    if (!_.has(configBefore, key)) {
      return { name: key, type: 'added', newValue };
    }
    if (_.isPlainObject(oldValue) && _.isPlainObject(newValue)) {
      return { name: key, type: 'nested', children: compare(oldValue, newValue) };
    }
    if (oldValue !== newValue) {
      return {
        name: key, type: 'modified', oldValue, newValue,
      };
    }
    return {
      name: key, type: 'same', oldValue, newValue,
    };
  });
};

export default (configPath1, configPath2, format = 'stylish') => {
  const ext1 = path.extname(configPath1);
  const ext2 = path.extname(configPath2);
  const configOld = parse(fs.readFileSync(configPath1, 'utf-8'), ext1);
  const configNew = parse(fs.readFileSync(configPath2, 'utf-8'), ext2);
  const formatter = getFormatter(format);

  const ast = compare(configOld, configNew);
  return `${formatter(ast)}`;
};
