import program from 'commander';
import compareFiles from './extensionManager';

export default () => {
  program
    .version('1.0.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-d, --debug', 'output extra debugging')
    .option('-f, --format [type]', 'output format: plain, json, default', 'default')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      console.log(compareFiles(firstConfig, secondConfig, program.format));
    });

  program.parse(process.argv);
};
