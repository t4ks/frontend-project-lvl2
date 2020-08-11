/* eslint-disable no-undef */
import path from 'path';
import genDiff from '../gendiff';

test('diff 1', () => {
  expect(genDiff(path.resolve(__dirname, 'file1.json'), path.resolve(__dirname, 'file2.json'))).toEqual(`
{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`);
});
