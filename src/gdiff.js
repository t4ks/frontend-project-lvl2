/* eslint-disable no-param-reassign */
import fs from 'fs';
import _ from 'lodash';

const textFormat = (parsedJSONs) => {
  const lines = parsedJSONs.reduce((acc, elem) => {
    switch (elem.type) {
      case 'modified':
        acc += `  - ${elem.key}: ${elem.value.old}\n  + ${elem.key}: ${elem.value.new}\n`;
        break;
      case 'deleted':
        acc += `  - ${elem.key}: ${elem.value.old}\n`;
        break;
      case 'added':
        acc += `  + ${elem.key}: ${elem.value.new}\n`;
        break;
      default:
        acc += `    ${elem.key}: ${elem.value.old}\n`;
    }
    return acc;
  }, '');
  return `{\n${lines}}`;
};

export default (filepath1, filepath2) => {
  const f1 = JSON.parse(fs.readFileSync(filepath1, { encoding: 'utf-8' }));
  const f2 = JSON.parse(fs.readFileSync(filepath2, { encoding: 'utf-8' }));

  const result = _.concat(Object.keys(f1), Object.keys(f2))
    .reduce((acc, k) => {
      if (_.find(acc, (o) => o.key === k) !== undefined) {
        return acc;
      }

      // Rules
      const modified = _.has(f1, k) && _.has(f2, k) && _.get(f1, k) !== _.get(f2, k);
      const deleted = !_.has(f2, k) && _.has(f1, k);
      const added = _.has(f2, k) && !_.has(f1, k) && !deleted;

      // eslint-disable-next-line no-nested-ternary
      const type = modified === true ? 'modified' : deleted === true ? 'deleted' : added === true ? 'added' : 'same';
      acc.push({
        key: k,
        type,
        value: {
          old: _.get(f1, k, null),
          new: _.get(f2, k, null),
        },
      });
      return acc;
    }, []);

  return textFormat(_.sortBy(result, (o) => o.key));
};
