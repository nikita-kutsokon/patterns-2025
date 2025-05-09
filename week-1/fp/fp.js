const data = `city,population,area,density,country
  Shanghai,24256800,6340,af,China
  Delhi,16787941,1484,11313,India
  Lagos,16060303,1171,13712,Nigeria
  Istanbul,14160467,5461,2593,Turkey
  Tokyo,13513734,2191,6168,Japan
  Sao Paulo,12038175,1521,7914,Brazil
  Mexico City,8874724,1486,5974,Mexico
  London,8673713,1572,5431,United Kingdom
  New York City,8537673,784,10892,United States
  Bangkok,8280925,1569,5279,Thailand`;

const sortRowsByDensity = (rows) => rows.slice().sort((a, b) => b.density - a.density);
const getPercentageOfNumber = (value, maxValue) => Math.round((value * 100) / maxValue);
const parseStrToNumber = (str) => isNaN(parseInt(str.trim())) ? null : parseInt(str.trim());

const normalizeDataRow = (row) => {
    const rowValues = row.split(',');

    return {
        city: rowValues[0],
        country: rowValues[4],
        area: parseStrToNumber(rowValues[2]),
        density: parseStrToNumber(rowValues[3]),
        population: parseStrToNumber(rowValues[1]),
    }
};

const dataRows = data.trim().split("\n").slice(1);
const normalizedDataRows = dataRows.map(normalizeDataRow);
const normalizedSortedRowsByDensity = sortRowsByDensity(normalizedDataRows);

const maxDesnity = normalizedSortedRowsByDensity[0].density;

const output = normalizedSortedRowsByDensity.map(row => ({
  item: JSON.stringify(row),
  densityRatio: (maxDesnity && row.density) ? getPercentageOfNumber(row.density, maxDesnity) : null
}));

console.table(output)

module.exports = { normalizeDataRow, sortRowsByDensity, getPercentageOfNumber, parseStrToNumber };