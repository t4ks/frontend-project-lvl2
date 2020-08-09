#!/usr/bin/node --experimental-json-modules

import pkg from 'commander';
import packageConfig from '../package.json';
import genDiff from '../gendiff.js';

const { program } = pkg;

program.storeOptionsAsProperties(false);

program.version(packageConfig.version)
  .description(packageConfig.description)
  .option('-f, --format [type]', 'output format');

program.parse(process.argv);

genDiff('1', '2');
