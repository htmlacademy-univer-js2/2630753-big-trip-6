import createEvent from '../view/event-point-view';
import createEventEdit from '../view/event-edit-view.js';
import {render, replace, remove} from '../framework/render.js';
import { UserActionType, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #closeAllEditsHandler = null;
  #mode = Mode.DEFAULT;
  #event = null;
  #offers = null;
  #destinations = null;
  #eventItem = null;
  #eventEditItem = null;
  #eventsList = null;
  #dataChangeHandler = null;

  constructor(closeAllEditsHandler, dataChangeHandler, eventsList){
    this.#closeAllEditsHandler = closeAllEditsHandler;
    this.#dataChangeHandler = dataChangeHandler;
    this.#eventsList = eventsList;
  }

  init(event, offers, destinations){
    this.#event = event;
    this.#offers = offers;
    this.#destinations = destinations;

    const previosEventItem = this.#eventItem;
    const previosEventEditItem = this.#eventEditItem;

    this.#eventItem = new createEvent({
      event: this.#event,
      offers: this.#offers,
      destinations: this.#destinations,
      onEditClick: () => {
        this.#replaceCardToForm();
      },
      handleDataChange: this.#dataChangeHandler
    });

    this.#eventEditItem = new createEventEdit({
      event: this.#event,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#onSubmitButtonClickHandler,
      onDeleteClick: this.#handleDeleteClick,
      onCloseAction: this.#onFormCloseHandler
    });

    if (previosEventItem === null || previosEventEditItem === null) {
      render(this.#eventItem, this.#eventsList);
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

  #onSubmitButtonClickHandler = (update) => {
    this.#dataChangeHandler(
      UserActionType.UPDATE,
      UpdateType.MINOR,
      update
    );

    this.#replaceFormToCard();
  };

  #onFormCloseHandler = () =>{
    this.#replaceFormToCard();
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

  #handleDeleteClick = (point) =>{
    this.#dataChangeHandler(
      UserActionType.DELETE,
      UpdateType.MINOR,
      point
    );
  };

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  destroy = () => {
    remove(this.#eventItem);
    remove(this.#eventEditItem);
  };

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditItem.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditItem.updateElement({
        isDisabled: true,
        isDeleting: true
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventItem.shake();
      return;
    }

    const resetFormState = () => {
      this.#eventEditItem.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#eventEditItem.shake(resetFormState);
  }
}
