import {remove, render, RenderPosition} from '../framework/render.js';
import CreateNewEvent from '../view/event-new-view.js';
import {nanoid} from 'nanoid';
import { UpdateType, UserActionType } from '../const.js';

export default class NewPointPresenter {
  #eventsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #offers = null;
  #destinations = null;

  #pointEditItem = null;

  constructor(eventsListContainer, offers, destinations, onDataChange, onDestroy) {
    this.#eventsListContainer = eventsListContainer;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditItem !== null) {
      return;
    }

    this.#pointEditItem = new CreateNewEvent({
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    render(this.#pointEditItem, this.#eventsListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditItem === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditItem);
    this.#pointEditItem = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserActionType.ADD,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  setSaving() {
    this.#pointEditItem.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditItem.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#pointEditItem.shake(resetFormState);
  }
}
