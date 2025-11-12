export const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

export type CalendarDate = {
  label: string;
  dateKey: string;
  muted: boolean;
};

const pad = (value: number) => value.toString().padStart(2, "0");

export const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseIsoDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatMonthLabel = (year: number, month: number) =>
  `${year}년 ${month + 1}월`;

// 앞/뒤 달의 보조 날짜까지 포함한 6x7 형태 달력 데이터 생성
export const buildCalendarDates = (
  year: number,
  month: number
): CalendarDate[] => {
  const dates: CalendarDate[] = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const leadingDays = firstDayOfMonth.getDay();
  const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

  for (let i = leadingDays - 1; i >= 0; i--) {
    const day = lastDayOfPrevMonth - i;
    const date = new Date(year, month - 1, day);
    dates.push({
      label: day.toString(),
      dateKey: toIsoDate(date),
      muted: true,
    });
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    dates.push({
      label: day.toString(),
      dateKey: toIsoDate(date),
      muted: false,
    });
  }

  const trailingCells = dates.length % 7 === 0 ? 0 : 7 - (dates.length % 7);
  for (let day = 1; day <= trailingCells; day++) {
    const date = new Date(year, month + 1, day);
    dates.push({
      label: day.toString(),
      dateKey: toIsoDate(date),
      muted: true,
    });
  }

  return dates;
};

export const formatCalendarDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${year}. ${month}. ${day}.`;
};

// ISO 날짜를 "10월 5일 (일)" 형식으로 변환
export const formatWeeklySummaryDate = (isoDate: string) => {
  const date = parseIsoDate(isoDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];
  return `${month}월 ${day}일 (${weekdayNames[date.getDay()]})`;
};
