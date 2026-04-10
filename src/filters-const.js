import { isFuturePoint, isPastPoint, isPresentPoint } from './filters-utils';

const filtersTypes = {
  FUTURE: 'future',
  PAST: 'past',
  EVERYTHING: 'everything',
  PRESENT: 'present'
};

const filter = {
  [filtersTypes.EVERYTHING]: (points) => points,
  [filtersTypes.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [filtersTypes.PAST]: (points) => points.filter((point) => isPastPoint(point)),
  [filtersTypes.PRESENT]: (points) => points.filter((point) => isPresentPoint(point))
};

export {filter};
