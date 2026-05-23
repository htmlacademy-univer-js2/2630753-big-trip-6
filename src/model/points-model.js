import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #offers = [];
  #destinations = [];
  #eventsApi = null;
  #isLoadingError = false;

  constructor({eventsApi}){
    super();
    this.#eventsApi = eventsApi;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get isLoadingError(){
    return this.#isLoadingError;
  }

  async init() {
    try {
      const points = await this.#eventsApi.points;
      const offers = await this.#eventsApi.offers;
      const destinations = await this.#eventsApi.destinations;

      this.#points = points.map(this.#adaptToClient);
      this.#offers = this.#adaptOffersToClient(offers);
      this.#destinations = destinations;
      this.#isLoadingError = false;
    } catch (err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
      this.#isLoadingError = true;
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update){
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    try{
      const response = await this.#eventsApi.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }

  }

  async addPoint(updateType, update){
    try{
      const response = await this.#eventsApi.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];

      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Failed adding point');
    }
  }

  async deletePoint(updateType, update){
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    try{
      await this.#eventsApi.deletePoint(update);
      this.#points = [...this.#points.slice(0, index), ...this.#points.slice(index + 1)];
      this._notify(updateType);
    } catch(err){
      throw new Error('Failed deleting point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  #adaptOffersToClient(offers) {
    const adaptedOffers = {};

    offers.forEach((offer) => {
      adaptedOffers[offer.type] = offer.offers;
    });

    return adaptedOffers;
  }
}
