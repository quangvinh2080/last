import dayjs from 'dayjs';

export const getFormDatepicker = (date) => {
  return { 
    startDate: dayjs(date).format('YYYY-MM-DD'),
    endDate: dayjs(date).format('YYYY-MM-DD'),
  };
};

export const getFormDatepickerToday = () => {
  return { 
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  };
};

export const getFormDatepickerWithExpectedDays = (fromDate, expectedDays) => {
  return {
    startDate: dayjs(fromDate, 'YYYY-MM-DD').add(expectedDays, 'day').format('YYYY-MM-DD'),
    endDate: dayjs(fromDate, 'YYYY-MM-DD').add(expectedDays, 'day').format('YYYY-MM-DD'),
  }
};

export const getDaysBetween = (fromDate, toDate) => {
  const diff = dayjs(toDate, 'YYYY-MM-DD').diff(dayjs(fromDate, 'YYYY-MM-DD'), 'day');
  return diff;
};

export const getRemainingDays = (task) => {
  const expectedDate = dayjs(task.latest_date, 'YYYY-MM-DD').add(task.expected_days, 'day');
  return expectedDate.diff(dayjs(), 'day');
};
