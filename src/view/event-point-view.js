import { humanizeEventDueDate } from '../utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import he from 'he';
import { UserActionType, UpdateType } from '../const.js';

function offersTemplate(offerElements){

  return offerElements.map((offer) => `
                  <li class="event__offer">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                  </li>`).join('');
}

function eventTemplate(event, offersArr, destinationsArr){
  const {dateFrom, dateTo, type, basePrice, isFavorite} = event;
  const humanizeDate = humanizeEventDueDate(dateFrom);
  const startTime = dayjs(dateFrom).format('HH:mm');
  const endTime = dayjs(dateTo).format('HH:mm');

  const timeDifferenceDays = dayjs(dateTo).diff(dayjs(dateFrom), 'day');
  const timeDifferenceHours = dayjs(dateTo).diff(dayjs(dateFrom), 'hour') - timeDifferenceDays * 24;
  const timeDifferenceMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minutes') - timeDifferenceHours * 60 - timeDifferenceDays * 1440;

  const offerElements = offersArr[type].filter((offer) => event.offers.some((e) => e === offer.id));
  const destinationData = destinationsArr.find((d) => d.id === event.destination);

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dateFrom}">${humanizeDate}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${he.encode(destinationData ? `${destinationData.name}` : '')}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom}">${startTime}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo}">${endTime}</time>
                  </p>
                  <p class="event__duration">${timeDifferenceDays ? `${timeDifferenceDays}D` : ''} ${timeDifferenceHours ? `${timeDifferenceHours}H` : ''} ${timeDifferenceMinutes}M</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${offersTemplate(offerElements)}
                </ul>
                <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
}

export default class createEvent extends AbstractStatefulView{
  #event = null;
  #offers = null;
  #destinations = null;
  #handleEditClick = null;
  #handleDataChange = null;

  constructor({event, offers, destinations, onEditClick, handleDataChange}){
    super();
    this.#event = event;
    this.#offers = offers;
    this.#destinations = destinations;

    this.#handleEditClick = onEditClick;
    this.#handleDataChange = handleDataChange;

    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#onChangeFavourite);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  _restoreHandlers(){
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#onChangeFavourite);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template(){
    return eventTemplate(this.#event, this.#offers, this.#destinations);
  }

  #onChangeFavourite = () =>{
    this.#handleDataChange(
      UserActionType.UPDATE,
      UpdateType.MINOR,
      {...this.#event, isFavorite: !this.#event.isFavorite});
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
