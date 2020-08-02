#! /usr/bin/env node

import pkg from 'commander';
// import packageConfig from './package.json';

const { program } = pkg;

program.storeOptionsAsProperties(false);

program.version('1.0.0')
    .description('Compares two configuration files and shows a difference.')

program.parse(process.argv);