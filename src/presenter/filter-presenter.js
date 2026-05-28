import { FiltersTypes, filter } from '../filters-const';
import { remove, render, replace } from '../framework/render';
import CreateFilters from '../view/filters-view';
import { UpdateType } from '../const';

export default class FilterPresenter{
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterItem = null;

  constructor({filterContainer, filterModel, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;
    return Object.values(FiltersTypes).map((type) => ({
      type,
      points: filter[type](points)
    }));
  }

  init(){
    const filters = this.filters;
    const prevFilterItem = this.#filterItem;

    this.#filterItem = new CreateFilters({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterItem === null){
      render(this.#filterItem, this.#filterContainer);
      return;
    }

    replace(this.#filterItem, prevFilterItem);
    remove(prevFilterItem);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType){
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

}
