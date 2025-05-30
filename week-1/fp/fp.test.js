const assert = require('assert');
const {
  isValidNumber,
  parseStrToNumber,
  normalizeRawDataRow,
  getWithDensityRatio,
  getFirstPropertyValue,
  getPercentageOfMaxNumber,
  getSortedObjectsArrayByProperty,
} = require('./fp');

assert.strictEqual(isValidNumber(123), true, '123 is valid number');
assert.strictEqual(isValidNumber(NaN), false, 'NaN is not valid number');
assert.strictEqual(isValidNumber('123'), false, 'string "123" is not valid number');
assert.strictEqual(isValidNumber(null), false, 'null is not valid number');

assert.strictEqual(parseStrToNumber(' 1234 '), 1234, 'Should parse valid number');
assert.strictEqual(parseStrToNumber('abc'), null, 'Should return null for invalid input');
assert.strictEqual(parseStrToNumber(''), null, 'Empty string returns null');

const arr = [{ a: 1, b: 2 }, { a: 3 }];
assert.strictEqual(getFirstPropertyValue(arr, 'a'), 1, 'Should return first a property');
assert.strictEqual(getFirstPropertyValue(arr, 'b'), 2, 'Should return first b property');
assert.strictEqual(getFirstPropertyValue([], 'a'), null, 'Empty array returns null');
assert.strictEqual(getFirstPropertyValue([{ a: 0 }], 'a'), 0, 'Should return 0 if property is 0');
assert.strictEqual(getFirstPropertyValue(arr, 'c'), null, 'Should return null if property does not exist');

const rawRow = 'Shanghai,24256800,6340,3826,China';
const normalized = normalizeRawDataRow(rawRow);
assert.deepStrictEqual(normalized, {
  area: 6340,
  density: 3826,
  city: 'Shanghai',
  country: 'China',
  population: 24256800
}, 'Normalization should correctly parse all fields');

const rawRowInvalidDensity = 'Shanghai,24256800,6340,af,China';
const normalizedInvalidDensity = normalizeRawDataRow(rawRowInvalidDensity);
assert.strictEqual(normalizedInvalidDensity.density, null, 'Invalid density should be null');

assert.strictEqual(getPercentageOfMaxNumber(50, 200), 25, '50 is 25% of 200');
assert.strictEqual(getPercentageOfMaxNumber(null, 1000), null, 'null value returns null');
assert.strictEqual(getPercentageOfMaxNumber(50, 0), null, 'division by zero returns null');

const unsorted = [
  { city: 'A', density: 500 },
  { city: 'B', density: 1500 },
  { city: 'C', density: 1000 },
];

const sortedAsc = getSortedObjectsArrayByProperty(unsorted, 'density', 'asc');
assert.strictEqual(sortedAsc[0].city, 'A', 'Lowest density first in asc sort');
assert.strictEqual(sortedAsc[2].city, 'B', 'Highest density last in asc sort');

const sortedDesc = getSortedObjectsArrayByProperty(unsorted, 'density', 'desc');
assert.strictEqual(sortedDesc[0].city, 'B', 'Highest density first in desc sort');
assert.strictEqual(sortedDesc[2].city, 'A', 'Lowest density last in desc sort');

assert.notStrictEqual(sortedAsc, unsorted, 'Sorted array should be new instance');
assert.deepStrictEqual(unsorted, [
  { city: 'A', density: 500 },
  { city: 'B', density: 1500 },
  { city: 'C', density: 1000 },
], 'Original array remains unchanged');

const arrForTransform = [
  { city: 'X', density: 50 },
  { city: 'Y', density: 100 },
];
const maxDensity = 100;
const transformed = getWithDensityRatio(arrForTransform, maxDensity);

assert.strictEqual(transformed.length, arrForTransform.length, 'Length remains the same');
assert.strictEqual(transformed[0].densityRatio, 50, 'First item densityRatio is 50%');
assert.strictEqual(transformed[1].densityRatio, 100, 'Second item densityRatio is 100%');
assert.strictEqual(typeof transformed[0].city, 'string', 'Original properties preserved');

console.log('✅ All tests passed!');