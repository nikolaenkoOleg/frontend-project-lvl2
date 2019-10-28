import fs from 'fs';
import path from 'path';
import compareJson from '../src/compareJson';
import compareYaml from '../src/compareYaml';
import compareIni from '../src/compareIni';

const pathToFixture = path.resolve('__tests__/__fixtures__/result.json');
const result = fs.readFileSync(pathToFixture).toString();

test('compare 2 plain json', () => {
  expect(compareJson('./json/before.json', './json/after.json')).toBe(result.trim());
});

// test('compare 2 plain yaml', () => {
//   expect(compareYaml('./yaml/before.yaml', './yaml/after.yaml')).toBe(result.trim());
// });

// test('compare 2 plain ini', () => {
//   expect(compareIni('./ini/before.ini', './ini/after.ini')).toBe(result.trim());
// });

