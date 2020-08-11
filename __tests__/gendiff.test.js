/* eslint-disable no-undef */
import { fileURLToPath } from 'url';
import path from 'path';
import genDiff from '../gendiff';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
/* eslint-disable no-underscore-dangle */
const __dirname = path.dirname(__filename);

test('diff 1', () => {
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
