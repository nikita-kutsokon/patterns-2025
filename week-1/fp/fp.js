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

const isValidNumber = (value) => typeof value === "number" && !isNaN(value) ? true : false;
const parseStrToNumber = (str) => isValidNumber(parseInt(str.trim())) ? parseInt(str.trim()) : null;
const getFirstPropertyValue = (array, property) => array[0] && property in array[0] ? array[0][property] : null;
const getPercentageOfMaxNumber = (value, maxValue) => (value && maxValue && maxValue !== 0) ? Math.round((value * 100) / maxValue) : null;

const normalizeRawDataRow = (row) => {
  const rowValues = row.split(",");

  return {
    city: rowValues[0],
    country: rowValues[4],
    area: parseStrToNumber(rowValues[2]),
    density: parseStrToNumber(rowValues[3]),
    population: parseStrToNumber(rowValues[1]),
  };
};

const getSortedObjectsArrayByProperty = (array, property, order = "asc") =>
  array.sort((valA, valB) => {
    if (!(property in valA) || !(property in valB)) return 0;
  
    const a = valA[property];
    const b = valB[property];

    const orderMultiplier = order === "desc" ? -1 : 1;
    const comparisonResult = a > b ? 1 : a < b ? -1 : 0;

    return comparisonResult * orderMultiplier;
  });

const getWithDensityRatio = (array, maxDesnity) => 
  array.map(data => { 
    return {
        ...data, 
        densityRatio: getPercentageOfMaxNumber(data.density, maxDesnity) 
      }
  });


const rawDataRows = data.trim().split("\n").slice(1);
const normalizedDataRows = rawDataRows.map(normalizeRawDataRow);
const sortedByDensity = getSortedObjectsArrayByProperty(normalizedDataRows, "density", "desc");

const maxDesnity = getFirstPropertyValue(sortedByDensity, "density");
const withDensityRatio = getWithDensityRatio(sortedByDensity, maxDesnity);

const outputTable = withDensityRatio.map(({ densityRatio, ...rest }) => ({ item: JSON.stringify(rest), densityRatio }));

console.table(outputTable);

module.exports = {
  isValidNumber,
  parseStrToNumber,
  getWithDensityRatio,
  normalizeRawDataRow,
  getFirstPropertyValue,
  getPercentageOfMaxNumber,
  getSortedObjectsArrayByProperty,
};