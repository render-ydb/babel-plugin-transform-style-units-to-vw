import { basicProperties } from './constants';
export const toFixed = (number: number, precision: number) => {
  const multiplier = Math.pow(10, precision + 1);
  const wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
};

export const getFilterProperties = (
  includedProperties: string[] = [],
  excludedProperties: string[] = []
) => {
  return [...basicProperties, ...includedProperties].filter((property) => {
    return !excludedProperties.includes(property);
  });
};
