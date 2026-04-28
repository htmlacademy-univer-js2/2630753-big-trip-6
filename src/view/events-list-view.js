import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function eventsListTemplate(){
  return `<ul class="trip-events__list">
  
        </ul>`;
}

export default class createEventsList extends AbstractStatefulView{
  get template(){
    return eventsListTemplate();
  }
}
