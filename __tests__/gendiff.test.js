import fs from 'fs';
import path from 'path';
import compare from '../src/compare';

test('compare 2 plain json', () => {
  const pathToFixture = path.resolve('__tests__/__fixtures__/compare.result.json');
  const result = fs.readFileSync(pathToFixture).toString();
  expect(compare('./json/before.json', './json/after.json')).toBe(result.trim());
});
