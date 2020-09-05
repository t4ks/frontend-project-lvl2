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

test('diff yaml files stylish formatter', () => {
  expect(
    genDiff(
      getFixturePath('file1.yaml'),
      getFixturePath('file2.yaml'),
    ),
  ).toEqual(readFixtureFile('result.stylish'));
});

test('diff yaml/json files 1 stylish formatter', () => {
  expect(
    genDiff(
      getFixturePath('file1.yaml'),
      getFixturePath('file2.json'),
    ),
  ).toEqual(readFixtureFile('result.stylish'));
});

test('diff flat json two equals files stylish formatter', () => {
  expect(
    genDiff(
      getFixturePath('file1.json'),
      getFixturePath('file1.json'),
    ),
  ).toEqual(readFixtureFile('result_for_equal_files.stylish'));
});

test('diff jsons without extention stylish formatter', () => {
  expect(
    genDiff(
      getFixturePath('file1_1'),
      getFixturePath('file2.json'),
    ),
  ).toEqual(readFixtureFile('result.stylish'));
});

test('diff inis stylish formatter', () => {
  expect(
    genDiff(
      getFixturePath('file1.ini'),
      getFixturePath('file2.ini'),
    ),
  ).toEqual(readFixtureFile('result.stylish'));
});

test('diff jsons stylish formatter', () => {
  expect(
    genDiff(
      getFixturePath('file1.json'),
      getFixturePath('file2.json'),
    ),
  ).toEqual(readFixtureFile('result.stylish'));
});

test('diff json configs with plain formatter', () => {
  expect(
    genDiff(
      getFixturePath('file1.json'),
      getFixturePath('file2.json'),
      'plain',
    ),
  ).toEqual(readFixtureFile('result.plain'));
});

test('diff json configs with json formatter', () => {
  expect(
    genDiff(
      getFixturePath('file1.json'),
      getFixturePath('file2.json'),
      'json',
    ),
  ).toEqual(readFixtureFile('result.json'));
});
