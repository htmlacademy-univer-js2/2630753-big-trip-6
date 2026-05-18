const types = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const cities = ['Amsterdam', 'Chamonix', 'Geneva'];

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const SortType = {
  TIME: 'sort-time',
  PRICE: 'sort-price',
  DATE: 'sort-day'
};

const UserActionType = {
  ADD: 'ADD',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
  INIT: 'INIT'
};

const MethodType = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export {types, cities, UpdateType, SortType, UserActionType, MethodType};
