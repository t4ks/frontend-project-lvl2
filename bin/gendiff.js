#!/usr/bin/node --experimental-json-modules

import pkg from 'commander';
import path from 'path';
import packageConfig from '../package.json';
import genDiff from '../gendiff.js';
import stylish from '../src/formatters/stylish.js';
import plain from '../src/formatters/plain.js';

const { program } = pkg;

const SUPPORTED_FORMATTERS = { stylish, plain };

program.version(packageConfig.version)
  .description(packageConfig.description)
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2, cmdObj) => {
    const currentDir = process.cwd();
    const diff = genDiff(path.resolve(currentDir, filepath1),
      path.resolve(currentDir, filepath2),
      SUPPORTED_FORMATTERS[cmdObj.format]);
    console.log(`${diff}`);
  });

program.parse(process.argv);
