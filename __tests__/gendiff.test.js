import fs from 'fs';
import compare from '../src/compare';

test('compare 2 plain json', () => {
  const path = '/mnt/c/StudyAndProjects/Projects/github/frontend-project-lvl2/__tests__/__fixtures__/compare.result.json';
  const result = fs.readFileSync(path).toString();
  expect(compare('./json/before.json', './json/after.json')).toBe(result);
});
