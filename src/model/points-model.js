import {getRandomPoint} from '../mock/task.js';

const POINT_COUNT = 0;

export default class PointsModel {
  points = Array.from({length: POINT_COUNT}, getRandomPoint);

  getPoints() {
    return this.points;
  }
}
