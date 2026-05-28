import TripPresenter from './presenter/presenter.js';
import CreateTripMainInfo from './view/trip-main-info-view.js';
import { render, RenderPosition } from './framework/render.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import EventsApi from './api/events-api.js';

const tripEvents = document.querySelector('.trip-events');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripMain = document.querySelector('.trip-main');

const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic 7r4gr876wpqt';
const eventsApi = new EventsApi(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({eventsApi});
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(tripEvents, pointsModel, filterModel);
const filterPresenter = new FilterPresenter({filterContainer: tripControlsFilters, filterModel, pointsModel});

render(new CreateTripMainInfo(), tripMain, RenderPosition.AFTERBEGIN);

filterPresenter.init();
tripPresenter.init();
pointsModel.init();

