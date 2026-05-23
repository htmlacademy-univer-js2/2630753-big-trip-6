import AbstractView from '../framework/view/abstract-view.js';

export default class createLoadErrorMessage extends AbstractView {
  get template() {
    return '<p class="trip-events__msg">Failed to load current events</p>';
  }
}
