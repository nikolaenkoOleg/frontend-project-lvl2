import program from 'commander';
import path from 'path';
import compareJson from './compareJson';
import compareYaml from './compareYaml';

export default () => {
  program
    .version('1.0.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      const fileType = path.extname(firstConfig).replace('.', '');
      const parses = {
        yaml: () => compareYaml(firstConfig, secondConfig),
        json: () => compareJson(firstConfig, secondConfig),
      };

      console.log(parses[fileType](firstConfig, secondConfig));
    });

  program.parse(process.argv);

  // if (program.version) console.log(program.version);
  // if (program.format) console.log(`- ${program.format}`);
};
