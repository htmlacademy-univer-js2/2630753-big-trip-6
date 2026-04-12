import createTripSort from '../view/trip-sort-view.js';
import {render, RenderPosition} from '../framework/render.js';
import createSuggestionMessage from '../view/suggestion-window-create-event.js';
import createEventsList from '../view/events-list-view.js';
import PointPresenter from './point-presenter.js';

const pageBodyPageMain = document.querySelector('.page-body__page-main');
const pageBodyContainer = pageBodyPageMain.querySelector('.page-body__container');

export default class TripPresenter{
  #boardEvents = [];
  #pointsModel = null;
  #eventsContainer = null;
  #pointPresenters = new Map();
  #count = 0;

  constructor({eventsContainer, pointsModel}){
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init(){
    this.#eventsContainer.innerHTML = '';
    this.#boardEvents = [...this.#pointsModel.getPoints()];

    const filtersArray = document.querySelectorAll('.trip-filters__filter-input');

    if (this.#boardEvents.length === 0){
      render(new createSuggestionMessage(), this.#eventsContainer);

      filtersArray.forEach((filter) => {
        filter.addEventListener('click', () => {
          pageBodyContainer.innerHTML = '';
          render(new createSuggestionMessage(), pageBodyContainer, RenderPosition.AFTERBEGIN);
        });
      });
    } else{
      render(new createTripSort(), this.#eventsContainer, RenderPosition.AFTERBEGIN);
      render(new createEventsList(), this.#eventsContainer);
    }

    for (let i = 0; i < this.#boardEvents.length; i++){
      this.#renderTask(this.#boardEvents[i]);
    }
  }

  #renderTask(event){
    const makeFavorite = (button) => {
      if (!event.isFavourite){
        button.classList.add('event__favorite-btn--active');
      } else {
        button.classList.remove('event__favorite-btn--active');
      }
      event.isFavourite = !event.isFavourite;
    };

    const closeAllEdits = () =>{
      this.#pointPresenters.forEach((presenter) => presenter.resetView());
    };

    const eventsList = document.querySelector('.trip-events__list');

    const pointPresenter = new PointPresenter(makeFavorite, closeAllEdits, eventsList);
    pointPresenter.init(event);
    this.#pointPresenters.set(this.#count++, pointPresenter);
  }

}
