import createTripSort from '../view/trip-sort-view.js';
import {render, RenderPosition} from '../render.js';
import createEventEdit from '../view/event-edit-view.js';
import createEvent from '../view/event-point-view.js';

export default class TripPresenter{
  constructor({eventsContainer, pointsModel}){
    this.eventsContainer = eventsContainer;
    this.pointsModel = pointsModel;
  }

  init(){
    this.eventsContainer.innerHTML = '';
    this.boardEvents = [...this.pointsModel.getPoints()];

    render(new createEventEdit(), this.eventsContainer, RenderPosition.AFTERBEGIN);
    render(new createTripSort(), this.eventsContainer, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < this.boardEvents.length; i++){
      render(new createEvent({event: this.boardEvents[i]}), this.eventsContainer, RenderPosition.AFTEREND);
    }
  }
}
