import dayjs from 'dayjs';

const DATE_FORMAT = 'D MMMM';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizeEventDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

function getTimeDifference(start, end){
  const startT = start.split(':');
  const endT = end.split(':');

  const totalTime = (Number(endT[0]) - Number(startT[0])) * 60 + (Number(endT[1]) - Number(startT[1]));

  if (totalTime < 60){
    return `${totalTime}M`;
  } else {
    return `${Math.floor(totalTime / 60)}H ${totalTime % 60}M`;
  }

}

export {getRandomArrayElement, humanizeEventDueDate, getTimeDifference};
