#!/usr/bin/node --experimental-json-modules

import pkg from 'commander';
import path from 'path';
import packageConfig from '../package.json';
import genDiff from '../src/gendiff.js';

const { program } = pkg;

program.version(packageConfig.version)
  .description(packageConfig.description)
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2, cmdObj) => {
    const currentDir = process.cwd();
    const diff = genDiff(
      path.resolve(currentDir, filepath1),
      path.resolve(currentDir, filepath2),
      cmdObj.format,
    );
    console.log(`${diff}`);
  });

program.parse(process.argv);
