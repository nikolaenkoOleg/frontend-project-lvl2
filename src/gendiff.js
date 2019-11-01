import program from 'commander';
import compare from './extensionManager';

export default () => {
  program
    .version('1.0.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .arguments('<firstConfig> <secondConfig> [format]')
    .action((firstConfig, secondConfig, format) => {
      console.log(compare(firstConfig, secondConfig, format));
    });

  program.parse(process.argv);

  // if (program.version) console.log(program.version);
  // if (program.format) console.log(`- ${program.format}`);
};
