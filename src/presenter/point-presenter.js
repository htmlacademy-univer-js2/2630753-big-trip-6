import createEvent from '../view/event-point-view';
import createEventEdit from '../view/event-edit-view.js';
import {render, replace, remove} from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #changeFavouriteHandler = null;
  #closeAllEditsHandler = null;
  #mode = Mode.DEFAULT;
  #event = null;
  #eventItem = null;
  #eventEditItem = null;
  #eventsList = null;

  constructor(changeFavouriteHandler, closeAllEditsHandler, eventsList){
    this.#changeFavouriteHandler = changeFavouriteHandler;
    this.#closeAllEditsHandler = closeAllEditsHandler;
    this.#eventsList = eventsList;
  }

  init(event){
    this.#event = event;

    const previosEventItem = this.#eventItem;
    const previosEventEditItem = this.#eventEditItem;

    this.#eventItem = new createEvent({
      event: this.#event,
      onEditClick: () => {
        this.#replaceCardToForm();
      }
    });

    this.#eventEditItem = new createEventEdit({
      event: this.#event,
      onFormSubmit: () => {
        this.#replaceFormToCard();
      }
    });

    if (previosEventItem === null || previosEventEditItem === null) {
      render(this.#eventItem, this.#eventsList);

      const favoritesList = document.querySelectorAll('.event__favorite-btn');
      const favoritesLastElement = favoritesList[favoritesList.length - 1];

      favoritesLastElement.addEventListener('click', () => {
        this.#changeFavouriteHandler(favoritesLastElement);
      });

      return;
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditItem, previosEventEditItem);
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventItem, previosEventItem);
    }

    remove(previosEventItem);
    remove(previosEventEditItem);

  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replaceCardToForm() {
    replace(this.#eventEditItem, this.#eventItem);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#closeAllEditsHandler();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#eventItem, this.#eventEditItem);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

}
