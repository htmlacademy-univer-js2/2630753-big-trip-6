import dayjs from 'dayjs';

const DATE_FORMAT = 'D MMMM';

function getCurrentDate(){
  const now = dayjs(new Date());

  return dayjs(now);
}

function humanizeEventDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

function isDatesEqual (dateA, dateB) {
  if (!dateA && !dateB) {
    return true;
  }

  if (!dateA || !dateB) {
    return false;
  }

  return new Date(dateA).getTime() === new Date(dateB).getTime();
}

export {humanizeEventDueDate, getCurrentDate, isDatesEqual};
