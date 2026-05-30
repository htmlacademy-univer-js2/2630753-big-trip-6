import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function getFiltersItemTemplate(filter, isChecked){
  const {type} = filter;

  return `
                <div class="trip-filters__filter">
                  <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" 
                  ${isChecked ? 'checked' : ''} 
                  >

                  <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
                </div>

                <button class="visually-hidden" type="submit">Accept filter</button>
              `;
}

function getFiltersTemplate(filterItems, currentFilterType){
  const filterItemsTemplate = filterItems
    .map((filter) => getFiltersItemTemplate(filter, filter.type === currentFilterType))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}
          </form>`;
}

export default class CreateFilters extends AbstractStatefulView{
  #filters = null;
  #currentFilterType = null;
  #onFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}){
    super();

    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#onFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#handleFilterTypeChange);
  }

  #handleFilterTypeChange = (evt) =>{
    this.#onFilterTypeChange(evt.target.value);
  };

  get template(){
    return getFiltersTemplate(this.#filters, this.#currentFilterType);
  }
}
