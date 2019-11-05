import program from 'commander';
import compare from './extensionManager';

export default () => {
  program
    .version('1.0.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-d, --debug', 'output extra debugging')
    .option('-f, --format [type]', 'output format: plain, default', 'default')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      console.log(compare(firstConfig, secondConfig, program.format));
    });

  program.parse(process.argv);
};
