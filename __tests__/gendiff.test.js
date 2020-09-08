/* eslint-disable no-undef */
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import genDiff from '../index.js';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
/* eslint-disable no-underscore-dangle */
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixtureFile = (filename) => fs.readFileSync(getFixturePath(filename), { encoding: 'utf-8' });

test.each(
  [
    // json files
    ['file1.json', 'file2.json', 'stylish', 'result.stylish'],
    ['file1.json', 'file2.json', 'plain', 'result.plain'],
    ['file1.json', 'file2.json', 'json', 'result.json'],
    ['file1.json', 'file1.json', 'stylish', 'result_for_equal_files.stylish'],

    // yaml files
    ['file1.yaml', 'file2.yaml', 'stylish', 'result.stylish'],
    ['file1.yaml', 'file2.yaml', 'plain', 'result.plain'],
    ['file1.yaml', 'file2.yaml', 'json', 'result.json'],

    // ini files
    ['file1.ini', 'file2.ini', 'plain', 'result.plain'],
    ['file1.ini', 'file2.ini', 'stylish', 'result.stylish'],

    // crossed formats
    ['file1.yaml', 'file2.json', 'stylish', 'result.stylish'],
    ['file1.ini', 'file2.json', 'stylish', 'result.stylish'],
    ['file1.yaml', 'file2.ini', 'stylish', 'result.stylish'],
  ],
)('diff file: %s and file: %s using formatter: %s', (file1, file2, formatter, expected) => {
  expect(
    genDiff(
      getFixturePath(file1),
      getFixturePath(file2),
      formatter,
    ),
  ).toEqual(readFixtureFile(expected));
});
