import program from 'commander';
import compare from './compare';

export default () => {
  program
    .version('1.0.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      console.log(compare(firstConfig, secondConfig));
    });

  program.parse(process.argv);

  if (program.version) console.log(program.version);
  if (program.format) console.log(`- ${program.format}`);
};
