import createTripSort from '../view/trip-sort-view.js';
import {render, RenderPosition} from '../render.js';
import createEventEdit from '../view/event-edit-view.js';
import createEvent from '../view/event-point-view.js';

const EVENTS_COUNT = 3;

export default class TripPresenter{
  constructor({eventsContainer}){
    this.eventsContainer = eventsContainer;
  }

  init(){
    this.eventsContainer.innerHTML = '';

    render(new createEventEdit(), this.eventsContainer, RenderPosition.AFTERBEGIN);
    render(new createTripSort(), this.eventsContainer, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < EVENTS_COUNT; i++){
      render(new createEvent(), this.eventsContainer, RenderPosition.AFTEREND);
    }
  }
}
