import createTripSort from '../view/trip-sort-view.js';
import {render, RenderPosition, replace} from '../framework/render.js';
import createEventEdit from '../view/event-edit-view.js';
import createEvent from '../view/event-point-view.js';
import createSuggestionMessage from '../view/suggestion-window-create-event.js';
import createEventsList from '../view/events-list-view.js';

const pageBodyPageMain = document.querySelector('.page-body__page-main');
const pageBodyContainer = pageBodyPageMain.querySelector('.page-body__container');

export default class TripPresenter{
  #boardEvents = [];
  #pointsModel = null;
  #eventsContainer = null;

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
    const eventsList = document.querySelector('.trip-events__list');

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const eventItem = new createEvent({
      event,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const eventEditItem = new createEventEdit({
      event,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(eventEditItem, eventItem);
    }

    function replaceFormToCard() {
      replace(eventItem, eventEditItem);
    }

    render(eventItem, eventsList);
  }
}
