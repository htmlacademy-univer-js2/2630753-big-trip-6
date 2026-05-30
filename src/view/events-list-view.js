import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function getEventsListTemplate(){
  return `<ul class="trip-events__list">
  
        </ul>`;
}

export default class CreateEventsList extends AbstractStatefulView{
  get template(){
    return getEventsListTemplate();
  }
}
