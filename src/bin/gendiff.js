#!/usr/bin/env node

import program from 'commander';
import parse from '..';

const gendiff = () => {
  program
    .version('1.0.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-d, --debug', 'output extra debugging')
    .option('-f, --format [type]', 'output format: plain, json, tree', 'tree')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      console.log(parse(firstConfig, secondConfig, program.format));
    });

  program.parse(process.argv);
};

gendiff();
