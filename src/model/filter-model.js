import Observable from '../framework/observable.js';
import { FiltersTypes } from '../filters-const.js';

export default class FilterModel extends Observable {
  #filter = FiltersTypes.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  };
}
