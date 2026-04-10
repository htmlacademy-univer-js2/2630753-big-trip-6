import AbstractView from '../framework/view/abstract-view.js';

function filtersItemTemplate(filter, isChecked){
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

function filtersTemplate(filterItems){
  const filterItemsTemplate = filterItems
    .map((filter, index) => filtersItemTemplate(filter, index === 0))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}
          </form>`;
}

export default class createFilters extends AbstractView{
  #filter = null;

  constructor({filter}){
    super();

    this.#filter = filter;
  }

  get template(){
    return filtersTemplate(this.#filter);
  }
}
