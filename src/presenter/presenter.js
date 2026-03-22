import createTripSort from '../view/trip-sort-view.js';
import {render, RenderPosition, replace} from '../framework/render.js';
import createEventEdit from '../view/event-edit-view.js';
import createEvent from '../view/event-point-view.js';

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

    render(new createTripSort(), this.#eventsContainer, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < this.#boardEvents.length; i++){
      this.#renderTask(this.#boardEvents[i]);
    }

  }

  #renderTask(event){
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

    render(eventItem, this.#eventsContainer);
  }
}
