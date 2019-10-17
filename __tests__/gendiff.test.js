import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import compareJson from '../src/compareJson';
import compareYaml from '../src/compareYaml';

test('compare 2 plain json', () => {
  const pathToFixture = path.resolve('__tests__/__fixtures__/compare.result.json');
  const result = fs.readFileSync(pathToFixture).toString();
  expect(compareJson('./json/before.json', './json/after.json')).toBe(result.trim());
});

test('compare 2 plain yaml', () => {
  const pathToFixture = path.resolve('__tests__/__fixtures__/compareYAML.result.yaml');
  const result = fs.readFileSync(pathToFixture).toString();
  expect(compareYaml('./yaml/before.yaml', './yaml/after.yaml')).toBe(result.trim());
});

