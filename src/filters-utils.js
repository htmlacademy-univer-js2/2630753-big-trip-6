import dayjs from 'dayjs';
import { getCurrentDate } from './utils';


function isFuturePoint(point){
  const date = dayjs(point.dueDate);
  return dayjs(date).isAfter(getCurrentDate());
}

function isPastPoint(point){
  const date = dayjs(point.dueDate);
  return dayjs(date).isBefore(getCurrentDate());
}

function isPresentPoint(point){
  const date = dayjs(point.dueDate);
  return dayjs(date).isSame(getCurrentDate());
}

export {isFuturePoint, isPastPoint, isPresentPoint};
