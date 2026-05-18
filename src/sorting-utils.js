import dayjs from 'dayjs';

const sortEventDate = (taskA, taskB) => dayjs(taskA.dateFrom).diff(dayjs(taskB.dateFrom));

const sortEventTime = (taskA, taskB) => {
  const timeOne = dayjs(taskA.dateFrom).diff(dayjs(taskA.dateTo), 'minutes');
  const timeTwo = dayjs(taskB.dateFrom).diff(dayjs(taskB.dateTo), 'minutes');
  return timeOne - timeTwo;
};

const sortEventPrice = (taskA, taskB) => taskB.basePrice - taskA.basePrice;

const sortStats = (taskA, taskB) => taskB[1] - taskA[1];

export { sortEventDate, sortEventTime, sortEventPrice, sortStats};
