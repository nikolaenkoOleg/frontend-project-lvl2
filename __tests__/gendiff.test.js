import fs from 'fs';
import path from 'path';
import compareFiles from '../src/extensionManager';

const pathToFile = path.resolve('__tests__/__fixtures__/result.txt');
const pathToPlainFile = path.resolve('__tests__/__fixtures__/plainResult.txt');

const result = fs.readFileSync(pathToFile).toString().replace(/\s/g, '');
const plainResult = fs.readFileSync(pathToPlainFile).toString().replace(/\s/g, '');

test('compare 2 json', () => {
  expect(compareFiles('./json/before.json', './json/after.json').replace(/\s/g, '')).toEqual(result);
});

test('compare 2 yaml', () => {
  expect(compareFiles('./yaml/before.yaml', './yaml/after.yaml').replace(/\s/g, '')).toEqual(result);
});

test('compare 2 ini', () => {
  expect(compareFiles('./ini/before.ini', './ini/after.ini').replace(/\s/g, '')).toEqual(result);
});

test('plain output test', () => {
  expect(compareFiles('./ini/before.ini', './ini/after.ini', 'plain').replace(/\s/g, '')).toEqual(plainResult);
});


