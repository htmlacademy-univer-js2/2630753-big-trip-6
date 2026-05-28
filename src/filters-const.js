import { isFuturePoint, isPastPoint, isPresentPoint } from './filters-utils';

const FiltersTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const filter = {
  [FiltersTypes.EVERYTHING]: (points) => points,
  [FiltersTypes.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [FiltersTypes.PAST]: (points) => points.filter((point) => isPastPoint(point)),
  [FiltersTypes.PRESENT]: (points) => points.filter((point) => isPresentPoint(point))
};

export {filter, FiltersTypes};
