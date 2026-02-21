import createFilters from './view/filters-view.js';
import TripPresenter from './presenter/presenter.js';
import createTripMainInfo from './view/trip-main-info-view.js';
import { render, RenderPosition } from './render.js';

const tripEvents = document.querySelector('.trip-events');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripMain = document.querySelector('.trip-main');
const tripPresenter = new TripPresenter({eventsContainer: tripEvents});

render(new createTripMainInfo(), tripMain, RenderPosition.AFTERBEGIN);
render(new createFilters(), tripControlsFilters);

tripPresenter.init();
