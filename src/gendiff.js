import fs from 'fs';
import path from 'path';

export default (filepath1, filepath2) => {
  const f1 = fs.readFileSync(path.resolve(filepath1), { encoding: 'utf-8' });
  const f2 = fs.readFileSync(path.resolve(filepath2), { encoding: 'utf-8' });
  console.log('F1 -> ', f1);
  console.log('F2 -> ', f2);
}