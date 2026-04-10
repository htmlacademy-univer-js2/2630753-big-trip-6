import createFilters from './view/filters-view.js';
import { generateFilters } from './filters-mock.js';
import TripPresenter from './presenter/presenter.js';
import createTripMainInfo from './view/trip-main-info-view.js';
import { render, RenderPosition } from './framework/render.js';
import PointsModel from './model/points-model.js';

const tripEvents = document.querySelector('.trip-events');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripMain = document.querySelector('.trip-main');

const pointsModel = new PointsModel();
const filter = generateFilters(pointsModel.points);
const tripPresenter = new TripPresenter({eventsContainer: tripEvents, pointsModel});

render(new createTripMainInfo(), tripMain, RenderPosition.AFTERBEGIN);
render(new createFilters({filter}), tripControlsFilters);

tripPresenter.init();
