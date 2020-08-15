/* eslint-disable no-undef */
import { fileURLToPath } from 'url';
import path from 'path';
import genDiff from '../gendiff';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
/* eslint-disable no-underscore-dangle */
const __dirname = path.dirname(__filename);

test('diff flat json files', () => {
  expect(
    genDiff(
      path.resolve(__dirname, '..', '__fixtures__', 'file1.json'),
      path.resolve(__dirname, '..', '__fixtures__', 'file2.json'),
    ),
  ).toEqual(`
{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`);
});

test('diff flat yaml files', () => {
  expect(
    genDiff(
      path.resolve(__dirname, '..', '__fixtures__', 'file1.yaml'),
      path.resolve(__dirname, '..', '__fixtures__', 'file2.yaml'),
    ),
  ).toEqual(`
{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`);
});

test('diff flat yaml/json files 1', () => {
  expect(
    genDiff(
      path.resolve(__dirname, '..', '__fixtures__', 'file1.yaml'),
      path.resolve(__dirname, '..', '__fixtures__', 'file2.json'),
    ),
  ).toEqual(`
{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`);
});

test('diff flat yaml/json files 2', () => {
  expect(
    genDiff(
      path.resolve(__dirname, '..', '__fixtures__', 'file2.json'),
      path.resolve(__dirname, '..', '__fixtures__', 'file1.yaml'),
    ),
  ).toEqual(`
{
  + follow: false
    host: hexlet.io
  + proxy: 123.234.53.22
  - timeout: 20
  + timeout: 50
  - verbose: true
}`);
});

test('diff flat json two equals files', () => {
  expect(
    genDiff(
      path.resolve(__dirname, '..', '__fixtures__', 'file1.json'),
      path.resolve(__dirname, '..', '__fixtures__', 'file1.json'),
    ),
  ).toEqual(`
{
    follow: false
    host: hexlet.io
    proxy: 123.234.53.22
    timeout: 50
}`);
});

test('diff jsons without extention', () => {
  expect(
    genDiff(
      path.resolve(__dirname, '..', '__fixtures__', 'file1_1'),
      path.resolve(__dirname, '..', '__fixtures__', 'file2.json'),
    ),
  ).toEqual(`
{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`);
});

test('diff inis', () => {
  expect(
    genDiff(
      path.resolve(__dirname, '..', '__fixtures__', 'file1.ini'),
      path.resolve(__dirname, '..', '__fixtures__', 'file2.ini'),
    ),
  ).toEqual(`
{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`);
});


test('diff the same ini and json', () => {
  expect(
    genDiff(
      path.resolve(__dirname, '..', '__fixtures__', 'file1.json'),
      path.resolve(__dirname, '..', '__fixtures__', 'file1.ini'),
    ),
  ).toEqual(`
{
    follow: false
    host: hexlet.io
    proxy: 123.234.53.22
    timeout: 50
}`);
});
