import createTripSort from '../view/trip-sort-view.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import createSuggestionMessage from '../view/suggestion-window-create-event.js';
import createEventsList from '../view/events-list-view.js';
import createLoadMessage from '../view/data-loading-view.js';
import PointPresenter from './point-presenter.js';
import { filter, filtersTypes } from '../filters-const.js';
import { UpdateType, SortType, UserActionType } from '../const.js';
import { sortEventDate, sortEventPrice, sortEventTime } from '../sorting-utils.js';
import NewPointPresenter from './new-point-presenter.js';
import { nanoid } from 'nanoid';

const newEventButton = document.querySelector('.trip-main__event-add-btn');

export default class TripPresenter{
  #pointsModel = null;
  #filterModel = null;
  #filterType = filtersTypes.EVERYTHING;
  #currentSortType = SortType.DATE;
  #eventsContainer = null;
  #pointPresenters = new Map();

  #tripSort = null;
  #suggestionMessage = new createSuggestionMessage();
  #eventsList = new createEventsList();
  #newEvent = null;
  #loadScreen = null;

  constructor(eventsContainer, pointsModel, filterModel){
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

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
    this.#pointPresenters.set(nanoid(), pointPresenter);
  }

  #switchNewEnableButton = () => {
    newEventButton.disabled = false;
  };

  #renderNewEvent = () =>{
    this.#filterModel.setFilter(UpdateType.MAJOR, filtersTypes.EVERYTHING);
    this.#currentSortType = SortType.DATE;

    const eventsList = document.querySelector('.trip-events__list');
    this.#newEvent = new NewPointPresenter(eventsList, this.offers, this.destinations, this.#handleViewAction, this.#switchNewEnableButton);

    this.#newEvent.init();
    newEventButton.disabled = true;
  };

  #renderSort = () =>{
    this.#tripSort = new createTripSort({
      currentSortType: this.#currentSortType,
      handleSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#tripSort, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType){
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT: {
        if (this.#loadScreen) {
          remove(this.#loadScreen);
        }

        this.#renderLoad();
        this.#clearBoard();
        this.#renderBoard();

        break;
      }
    }
  };

  #handleViewAction = async (actionType, updateType, update) =>{
    switch (actionType){
      case UserActionType.ADD:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserActionType.DELETE:
        this.#pointsModel.deletePoint(updateType, update);
        break;
      case UserActionType.UPDATE:
        this.#pointsModel.updatePoint(updateType, update);
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderLoad() {
    this.#loadScreen = new createLoadMessage();
    render(this.#loadScreen, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderBoard = () => {
    const pointsArr = this.points;

    const filtersArray = document.querySelectorAll('.trip-filters__filter-input');

    if (pointsArr.length === 0){
      render(this.#suggestionMessage, this.#eventsContainer);

      filtersArray.forEach((filterItem) => {
        filterItem.addEventListener('click', () => {
          this.#eventsContainer.innerHTML = '';
          render(this.#suggestionMessage, this.#eventsContainer, RenderPosition.AFTERBEGIN);
        });
      });
    } else{
      this.#renderSort();
      remove(this.#loadScreen);
      render(this.#eventsList, this.#eventsContainer);
    }

    newEventButton.addEventListener('click', this.#renderNewEvent);

    for (let i = 0; i < pointsArr.length; i++){
      this.#renderEvent(pointsArr[i], this.offers, this.destinations);
    }
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    if (resetSortType){
      this.#currentSortType = SortType.DATE;
    }

    remove(this.#loadScreen);
    remove(this.#tripSort);
    remove(this.#suggestionMessage);
    remove(this.#eventsList);

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

}

