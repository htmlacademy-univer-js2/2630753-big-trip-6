import CreateTripSort from '../view/trip-sort-view.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import CreateSuggestionMessage from '../view/suggestion-window-create-event.js';
import CreateEventsList from '../view/events-list-view.js';
import CreateLoadMessage from '../view/data-loading-view.js';
import CreateLoadErrorMessage from '../view/data-error-loading-view.js';
import PointPresenter from './point-presenter.js';
import { filter, FiltersTypes } from '../filters-const.js';
import { UpdateType, SortType, UserActionType } from '../const.js';
import { sortEventDate, sortEventPrice, sortEventTime } from '../sorting-utils.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const newEventButton = document.querySelector('.trip-main__event-add-btn');

export default class TripPresenter{
  #pointsModel = null;
  #filterModel = null;
  #filterType = FiltersTypes.EVERYTHING;
  #currentSortType = SortType.DATE;
  #eventsContainer = null;
  #pointPresenters = new Map();

  #tripSort = null;
  #suggestionMessage = new CreateSuggestionMessage();
  #eventsList = new CreateEventsList();
  #newEvent = null;
  #loadScreen = null;
  #loadErrorScreen = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: 500,
    upperLimit: 1500
  });

  constructor(eventsContainer, pointsModel, filterModel){
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    newEventButton.disabled = true;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points(){
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;

    const filteredPoints = filter[this.#filterType](points);

    switch(this.#currentSortType){
      case SortType.TIME:
        return filteredPoints.sort(sortEventTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortEventPrice);
      case SortType.DATE:
        return filteredPoints.sort(sortEventDate);
    }

    return filteredPoints;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  init(){
    this.#renderLoad();
    this.#renderBoard();
  }

  #renderEvent(event, offers, destinations){
    const closeAllEdits = () =>{
      this.#pointPresenters.forEach((presenter) => presenter.resetView());
    };

    const eventsList = document.querySelector('.trip-events__list');

    const pointPresenter = new PointPresenter(closeAllEdits, this.#handleViewAction, eventsList);
    pointPresenter.init(event, offers, destinations);
    this.#pointPresenters.set(event.id, pointPresenter);
  }

  #switchNewEnableButton = () => {
    newEventButton.disabled = false;
  };

  #renderNewEvent = () =>{
    this.#filterModel.setFilter(UpdateType.MAJOR, FiltersTypes.EVERYTHING);
    this.#currentSortType = SortType.DATE;

    const eventsList = document.querySelector('.trip-events__list');
    this.#newEvent = new NewPointPresenter(eventsList, this.offers, this.destinations, this.#handleViewAction, this.#switchNewEnableButton);


    this.#newEvent.init();
    newEventButton.disabled = true;
  };

  #renderSort = () =>{
    this.#tripSort = new CreateTripSort({
      currentSortType: this.#currentSortType,
      handleSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#tripSort, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType){
      case UpdateType.PATCH:
        remove(this.#eventsList);
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        remove(this.#eventsList);
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT: {
        if (this.#loadScreen) {
          remove(this.#loadScreen);
        }

        if (this.#loadErrorScreen) {
          remove(this.#loadErrorScreen);
        }

        if (this.#pointsModel.isLoadingError) {
          newEventButton.disabled = true;
          this.#renderLoadError();
          return;
        }

        newEventButton.disabled = false;

        this.#clearBoard();
        this.#renderLoad();
        this.#renderBoard();

        break;
      }
    }
  };

  #handleViewAction = async (actionType, updateType, update) =>{
    this.#uiBlocker.block();
    switch (actionType){
      case UserActionType.ADD:
        this.#newEvent.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newEvent.setAborting();
        }
        break;
      case UserActionType.DELETE:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserActionType.UPDATE:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    remove(this.#eventsList);
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderLoad() {
    this.#loadScreen = new CreateLoadMessage();
    render(this.#loadScreen, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderLoadError(){
    this.#loadErrorScreen = new CreateLoadErrorMessage();
    render(this.#loadErrorScreen, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderBoard = () => {
    const points = this.points;

    const filtersArray = document.querySelectorAll('.trip-filters__filter-input');
    const loadScreen = document.querySelector('.trip-events__msg');

    if (points.length === 0){
      if (!loadScreen){
        render(this.#suggestionMessage, this.#eventsContainer);
      }

      filtersArray.forEach((filterItem) => {
        filterItem.addEventListener('click', () => {
          this.#clearBoard();
          render(this.#suggestionMessage, this.#eventsContainer, RenderPosition.AFTERBEGIN);
        });
      });
    } else{
      this.#renderSort();
      remove(this.#loadScreen);
      render(this.#eventsList, this.#eventsContainer);
    }

    newEventButton.addEventListener('click', this.#renderNewEvent);

    for (let i = 0; i < points.length; i++){
      this.#renderEvent(points[i], this.offers, this.destinations);
    }
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    if (resetSortType){
      this.#currentSortType = SortType.DATE;
    }

    remove(this.#loadScreen);
    remove(this.#tripSort);
    remove(this.#suggestionMessage);

    newEventButton.removeEventListener('click', this.#renderNewEvent);
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

}

