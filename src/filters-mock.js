import { filter } from './filters-const';

const generateFilters = (points) => Object.entries(filter).map(([filterType, filterPatternType]) => ({
  type: filterType,
  count: filterPatternType(points).length
}));

export {generateFilters};
