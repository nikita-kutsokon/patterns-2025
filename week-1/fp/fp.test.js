const assert = require('assert');
const { normalizeDataRow, sortRowsByDensity, getPercentageOfNumber, parseStrToNumber } = require('./fp');

assert.strictEqual(parseStrToNumber(' 1234 '), 1234, 'Should parse valid number');
assert.strictEqual(parseStrToNumber('abc'), null, 'Should return null for invalid input');

const rawRow = 'Shanghai,24256800,6340,3826,China';
const normalized = normalizeDataRow(rawRow);
assert.deepStrictEqual(normalized, {
  city: 'Shanghai',
  country: 'China',
  area: 6340,
  density: 3826,
  population: 24256800
}, 'Normalization should correctly parse all fields');

const unsorted = [
  { city: 'A', density: 500 },
  { city: 'B', density: 1500 },
  { city: 'C', density: 1000 },
];

const sorted = sortRowsByDensity(unsorted);
assert.strictEqual(sorted[0].city, 'B', 'City with highest density should be first');
assert.strictEqual(sorted[2].city, 'A', 'City with lowest density should be last');

assert.notStrictEqual(unsorted, sorted, 'Sorted array should be a new array (not the same reference as the original)');

assert.deepStrictEqual(unsorted, [
  { city: 'A', density: 500 },
  { city: 'B', density: 1500 },
  { city: 'C', density: 1000 },
], 'The original array should remain unchanged');

assert.strictEqual(getPercentageOfNumber(50, 200), 25, '50 is 25% of 200');
assert.strictEqual(getPercentageOfNumber(0, 1000), 0, '0% of any number is 0');

console.log('✅ All tests passed!');