import { types, cities } from '../const';
import { getRandomArrayElement, getTimeDifference } from '../utils';

const destinationtPoints = [{
  dueDate: '2019-04-13',
  eventType: getRandomArrayElement(types),
  city: getRandomArrayElement(cities),
  price: 20,
  isFavourite: getRandomArrayElement([true, false]),
  startTime: '10:30',
  endTime: '11:00',
  offers: {
    uber: false,
    meal: false,
    switchToComfort: false
  }
},

{
  dueDate: '2019-03-18',
  eventType: getRandomArrayElement(types),
  city: getRandomArrayElement(cities),
  price: 60,
  isFavourite: getRandomArrayElement([true, false]),
  startTime: '12:30',
  endTime: '15:00',
  offers: {
    uber: false,
    meal: false,
    switchToComfort: false
  }
},

{
  dueDate: '2019-05-08',
  eventType: getRandomArrayElement(types),
  city: getRandomArrayElement(cities),
  price: 35,
  isFavourite: getRandomArrayElement([true, false]),
  startTime: '14:00',
  endTime: '17:00',
  offers: {
    uber: false,
    meal: false,
    switchToComfort: false
  }

},

{
  dueDate: '2019-01-21',
  eventType: getRandomArrayElement(types),
  city: getRandomArrayElement(cities),
  price: 10,
  isFavourite: getRandomArrayElement([true, false]),
  startTime: '19:30',
  endTime: '22:00',
  offers: {
    uber: false,
    meal: false,
    switchToComfort: false
  }

},

{
  dueDate: '2019-01-21',
  eventType: getRandomArrayElement(types),
  city: getRandomArrayElement(cities),
  price: 70,
  isFavourite: getRandomArrayElement([true, false]),
  startTime: '13:30',
  endTime: '21:00',
  offers: {
    uber: false,
    meal: false,
    switchToComfort: false
  }

}];

destinationtPoints.forEach((elem) => {
  elem.timeDifference = getTimeDifference(elem.startTime, elem.endTime);
});

function getRandomPoint() {
  return getRandomArrayElement(destinationtPoints);
}

export {getRandomPoint};
