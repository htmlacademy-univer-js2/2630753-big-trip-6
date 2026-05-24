import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import he from 'he';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function photosTemplate(destinationData){
  return destinationData.pictures.map((picture) => `<img src="${picture.src}" alt="${picture.description}">`).join('');
}

function offersTemplate(offerElements, event){
  return offerElements.map((offer, idx) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${idx}" type="checkbox" name="event-offer-${idx}" ${event.offers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${idx}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join('');
}

function newPointTemplate(event, offersArr, destinationsArr){
  const {type, basePrice, dateFrom, dateTo, isDeleting, isSaving, isDisabled} = event;

  const offerElements = offersArr[type].filter((offer) => event.offers.some((e) => e === offer.id));
  const destinationData = destinationsArr.find((d) => d.id === event.destination);

  const startTime = dayjs(dateFrom).format('HH:mm');
  const endTime = dayjs(dateTo).format('HH:mm');

  const startDate = dayjs(dateFrom).format('DD/MM/YY');
  const endDate = dayjs(dateTo).format('DD/MM/YY');

  return `
    <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon" ${isDisabled ? 'disabled' : ''}>
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        <div class="event__type-item">
                          <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi"  ${type === 'taxi' ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type === 'bus' ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type === 'train' ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type === 'ship' ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type === 'drive' ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${type === 'flight' ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type === 'check-in' ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${type === 'sightseeing' ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type === 'restaurant' ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destinationData ? `${destinationData.name}` : '')}" list="destination-list-1" required>
                    <datalist id="destination-list-1">
                      <option value="Amsterdam"></option>
                      <option value="Geneva"></option>
                      <option value="Chamonix"></option>
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate} ${startTime}" required>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate} ${endTime}" required>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" required>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
                  <button class="event__reset-btn" type="reset" ${isDeleting ? 'disabled' : ''}>Cancel</button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                      ${offerElements ? offersTemplate(offersArr[type], event) : ''}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinationData ? destinationData.description : ''}</p>

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${destinationData ? photosTemplate(destinationData) : ''}
                      </div>
                    </div>
                  </section>
                </section>
              </form>
  `;
}


export default class createNewEvent extends AbstractStatefulView{
  #onFormSubmit = null;
  #onDeleteClick = null;
  #offers = null;
  #destinations = null;
  #flatpickerStartDate = null;
  #flatpickerEndDate = null;

  constructor({offers, destinations, onDeleteClick, onFormSubmit}){
    super();
    this.#offers = offers;
    this.#destinations = destinations;

    this._setState({
      id: nanoid(),
      type: 'flight',
      destination: [],
      basePrice: 1,
      dateFrom: '2026-01-01T02:15:05.620Z',
      dateTo: '2026-01-01T02:15:05.620Z',
      isFavorite: false,
      offers: []
    });

    this.#onFormSubmit = onFormSubmit;
    this.#onDeleteClick = onDeleteClick;

    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#onDeleteClickHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);
    this.#setDatepickerStart();
    this.#setDatepickerEnd();

    this._restoreHandlers();
  }

  get template(){
    return newPointTemplate(this._state, this.#offers, this.#destinations);
  }

  _restoreHandlers(){
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#onDeleteClickHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  #onDeleteClickHandler = (evt) =>{
    evt.preventDefault();
    this.#onDeleteClick();
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destinationTarget = evt.target.value;
    const newDestination = this.#destinations.find((d) => d.name === destinationTarget);
    this.updateElement({
      destination: newDestination.id
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const newPrice = evt.target.value;
    this.updateElement({
      basePrice: Number(newPrice)
    });
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const typeTarget = evt.target.value;
    this.updateElement({
      type: typeTarget,
      offers: []
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const normalizedPrice = Number(this._state.basePrice);
    this.#onFormSubmit({
      ...this._state,
      basePrice: Number.isFinite(normalizedPrice) && normalizedPrice > 0 ? Math.trunc(normalizedPrice) : 0
    });
  };

  #startDateChangeHandler = ([date]) =>{
    this.updateElement({dateFrom: date});
  };

  #endDateChangeHandler = ([date]) =>{
    this.updateElement({dateTo: date});
  };

  #setDatepickerStart = () => {
    this.#flatpickerStartDate = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onChange: this.#startDateChangeHandler,
      }
    );
  };

  #setDatepickerEnd = () => {
    this.#flatpickerEndDate = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        onChange: this.#endDateChangeHandler,
        minDate: this._state.dateFrom,
      }
    );
  };

  static parseEventToState(event) {
    return {...event,
      isDueDate: event.dateFrom !== null,
    };
  }

  static parseStateToEvent(state) {
    const event = {...state};

    if (!event.isDueDate) {
      event.dateFrom = null;
    }

    delete event.isDueDate;
    delete event.isRepeating;

    return event;
  }
}
