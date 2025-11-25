import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  buildCalendarDates,
  formatCalendarDate,
  formatMonthLabel,
  parseIsoDate,
  toIsoDate,
} from "../../../shared/calendar";

type SelectedTimesState = Record<string, string[]>;

const DEFAULT_VISIBLE_MONTH = { year: 2025, month: 9 };
const DEFAULT_SELECTED_DATE = "2025-10-05";

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
] as const;

type ProfCardCalendarProps = {
  selectedTimesByDate: SelectedTimesState;
  onChangeSelectedTimes: Dispatch<SetStateAction<SelectedTimesState>>;
};

export default function ProfCardCalendar({
  selectedTimesByDate,
  onChangeSelectedTimes,
}: ProfCardCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(DEFAULT_VISIBLE_MONTH);
  const [selectedDateKey, setSelectedDateKey] = useState<string>(
    DEFAULT_SELECTED_DATE
  );

  const calendarDates = useMemo(
    () => buildCalendarDates(visibleMonth.year, visibleMonth.month),
    [visibleMonth]
  );

  const selectedTimes = selectedTimesByDate[selectedDateKey] ?? [];
  const selectedTimesSet = new Set(selectedTimes);
  const selectedDateLabel = selectedDateKey
    ? formatCalendarDate(selectedDateKey)
    : "";

  /**
   * 날짜 클릭 핸들러
   * @param dateKey 선택된 날짜의 ISO 문자열
   * @param muted 비활성화된 날짜인지 여부
   */
  const handleDateClick = (dateKey: string, muted: boolean) => {
    if (muted) {
      const targetDate = parseIsoDate(dateKey);
      setVisibleMonth({
        year: targetDate.getFullYear(),
        month: targetDate.getMonth(),
      });
    }
    setSelectedDateKey(dateKey);
  };

  /**
   * 월 변경 핸들러
   * @param delta 변경할 월의 증감값
   */
  const handleMonthChange = (delta: number) => {
    setVisibleMonth((prev) => {
      const nextDate = new Date(prev.year, prev.month + delta, 1);
      setSelectedDateKey(toIsoDate(nextDate));
      return {
        year: nextDate.getFullYear(),
        month: nextDate.getMonth(),
      };
    });
  };

  /**
   * 시간 슬롯 토글 핸들러
   * @param slot 선택된 시간 슬롯
   */
  const handleTimeSlotToggle = (slot: string) => {
    onChangeSelectedTimes((prev) => {
      const prevSlots = prev[selectedDateKey] ?? [];
      const isSelected = prevSlots.includes(slot);
      const nextSlots = isSelected
        ? prevSlots.filter((time) => time !== slot)
        : [...prevSlots, slot];

      const nextState: SelectedTimesState = { ...prev };

      if (nextSlots.length) {
        nextState[selectedDateKey] = nextSlots;
      } else {
        delete nextState[selectedDateKey];
      }

      return nextState;
    });
  };

  return (
    <section className="prof-card prof-card--calendar">
      <div className="prof-card__header">
        <div>
          <h2 className="prof-card__title">내 면담 가능 시간 설정</h2>
          <p className="prof-card__helper">날짜 선택</p>
        </div>
        <button type="button" className="prof-card__action">
          편집
        </button>
      </div>

      <div className="prof-calendar">
        <div className="prof-calendar__header">
          <button
            type="button"
            className="prof-calendar__button"
            onClick={() => handleMonthChange(-1)}
          >
            ‹
          </button>
          <span className="prof-calendar__month">
            {formatMonthLabel(visibleMonth.year, visibleMonth.month)}
          </span>
          <button
            type="button"
            className="prof-calendar__button"
            onClick={() => handleMonthChange(1)}
          >
            ›
          </button>
        </div>

        <div className="prof-calendar__grid">
          {dayLabels.map((day) => (
            <span key={day} className="prof-calendar__day-label">
              {day}
            </span>
          ))}
          {calendarDates.map(({ label, muted, dateKey }) => (
            <span
              key={dateKey}
              className={[
                "prof-calendar__date",
                muted ? "prof-calendar__date--muted" : "",
                dateKey === selectedDateKey
                  ? "prof-calendar__date--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleDateClick(dateKey, muted)}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="prof-times">
        <p className="prof-times__caption">
          {selectedDateLabel ? `${selectedDateLabel} 가능 시간` : "가능 시간"}
        </p>
        <div className="prof-time-grid">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              className={[
                "prof-time-slot",
                selectedTimesSet.has(slot) ? "prof-time-slot--highlight" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleTimeSlotToggle(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div className="prof-times__footer">
        <span>선택된 시간: {selectedTimes.length}개</span>
        <span className="prof-pill">가을 학기 · 상담</span>
      </div>
    </section>
  );
}
