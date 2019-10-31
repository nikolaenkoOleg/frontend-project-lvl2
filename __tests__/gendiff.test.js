import fs from 'fs';
import path from 'path';
import compareFiles from '../src/formatManeger';

const pathToFixture = path.resolve('__tests__/__fixtures__/result.txt');
const result = fs.readFileSync(pathToFixture).toString();

test('compare 2 json', () => {
  expect(compareFiles('./json/before.json', './json/after.json').replace(/\s/g, '')).toEqual(result.replace(/\s/g, ''));
});

test('compare 2 yaml', () => {
  expect(compareFiles('./yaml/before.yaml', './yaml/after.yaml').replace(/\s/g, '')).toEqual(result.replace(/\s/g, ''));
});

test('compare 2 ini', () => {
  expect(compareFiles('./ini/before.ini', './ini/after.ini').replace(/\s/g, '')).toEqual(result.replace(/\s/g, ''));
});

