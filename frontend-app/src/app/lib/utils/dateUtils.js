export const formatMonthYear = (month, year) => {
  return `${year}-${String(month).padStart(2, "0")}`;
};

export const parseMonthYear = (monthYearString) => {
  const [year, month] = monthYearString.split("-");
  return {
    month: parseInt(month),
    year: parseInt(year),
  };
};

export const generateMonthsPaidArray = (
  fromMonth,
  fromYear,
  tillMonth,
  tillYear
) => {
  const months = [];
  let currentMonth = new Date(fromYear, fromMonth - 1);
  const endMonth = new Date(tillYear, tillMonth - 1);

  while (currentMonth <= endMonth) {
    months.push({
      month: currentMonth.getMonth() + 1,
      year: currentMonth.getFullYear(),
    });
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }
  return months;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getNextMonthYear = (currentMonth, currentYear) => {
  let nextMonth = currentMonth + 1;
  let nextYear = currentYear;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  return { month: nextMonth, year: nextYear };
};
