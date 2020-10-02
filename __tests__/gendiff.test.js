/* eslint-disable no-undef */
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import genDiff from '../index.js';
import getFormatter from '../src/formatters/index.js';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
/* eslint-disable no-underscore-dangle */
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixtureFile = (filename) => fs.readFileSync(getFixturePath(filename), { encoding: 'utf-8' });

test.each(
  [
    // json files
    ['json', 'stylish'],
    ['json', 'plain'],
    ['json', 'json'],

    // yaml files
    ['yaml', 'stylish'],
    ['yaml', 'plain'],
    ['yaml', 'json'],

    // ini files
    ['ini', 'plain'],
    ['ini', 'stylish'],
  ],
)('diff %s configs using formatter: %s', (ext, formatter) => {
  expect(
    genDiff(
      getFixturePath(`file1.${ext}`),
      getFixturePath(`file2.${ext}`),
      formatter,
    ),
  ).toEqual(readFixtureFile(`result.${formatter}`));
});

test.each(
  [
    ['yaml', 'json', 'stylish'],
    ['ini', 'json', 'stylish'],
    ['yaml', 'ini', 'stylish'],
    ['yaml', 'json', 'plain'],
    ['ini', 'json', 'plain'],
    ['yaml', 'ini', 'plain'],
    ['yaml', 'json', 'json'],
  ],
)('diff config: %s with config: %s using formatter: %s', (ext1, ext2, formatter) => {
  expect(
    genDiff(
      getFixturePath(`file1.${ext1}`),
      getFixturePath(`file2.${ext2}`),
      formatter,
    ),
  ).toEqual(readFixtureFile(`result.${formatter}`));
});

test.each(
  [
    ['json', 'stylish'],
    ['yaml', 'stylish'],
    ['ini', 'stylish'],
    ['json', 'json'],
    ['yaml', 'json'],
  ],
)('check the unchanged %s configs using formatter: %s', (ext, formatter) => {
  expect(
    genDiff(
      getFixturePath(`file1.${ext}`),
      getFixturePath(`file1.${ext}`),
      formatter,
    ),
  ).toEqual(readFixtureFile(`result_for_equal_files.${formatter}`));
});

test.each(
  [
    ['stylish', [{ type: 'changed' }]],
    ['plain', [{ type: 'changed' }]],
  ],
)('check error to unknown node type for formatter: %s', (format, ast) => {
  expect(() => getFormatter(format)(ast)).toThrowError(new Error('Unknown type=changed'));
});
