import { useMemo, useState } from "react";
import {
  buildCalendarDates,
  dayLabels,
  formatCalendarDate,
  formatMonthLabel,
  formatWeeklySummaryDate,
  parseIsoDate,
  toIsoDate,
} from "../../shared/calendar";
import "./profMain.css";

// ISO 날짜 문자열을 키로 갖는 선택 시간 상태 맵
type SelectedTimesState = Record<string, string[]>;

const DEFAULT_VISIBLE_MONTH = { year: 2025, month: 9 }; // 0-index 기반 (10월)
const DEFAULT_SELECTED_DATE = "2025-10-05";

// 모든 날짜가 공유하는 토글 가능한 기본 시간대 목록
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

// 초기 더미 데이터: 교수님이 미리 지정해 둔 가능한 시간
const DEFAULT_SELECTED_TIMES: SelectedTimesState = {
  "2025-10-05": ["14:00", "15:00"],
};

const summaryStats = [
  {
    icon: "📅",
    label: "이번 주 면담",
    value: "1건",
    iconClass: "",
  },
  {
    icon: "⏳",
    label: "대기 중인 요청",
    value: "0건",
    iconClass: "summary-card__icon--orange",
  },
  {
    icon: "👥",
    label: "총 면담 학생",
    value: "1명",
    iconClass: "summary-card__icon--blue",
  },
] as const;

export default function ProfMain() {
  const [visibleMonth, setVisibleMonth] = useState(DEFAULT_VISIBLE_MONTH);
  const [selectedTimesByDate, setSelectedTimesByDate] =
    useState<SelectedTimesState>(
      () =>
        Object.fromEntries(
          Object.entries(DEFAULT_SELECTED_TIMES).map(([date, times]) => [
            date,
            [...times],
          ])
        ) as SelectedTimesState
    );
  const [selectedDateKey, setSelectedDateKey] = useState(DEFAULT_SELECTED_DATE);

  const calendarDates = useMemo(
    () => buildCalendarDates(visibleMonth.year, visibleMonth.month),
    [visibleMonth]
  );

  const selectedTimes = selectedTimesByDate[selectedDateKey] ?? [];
  const selectedTimesSet = new Set(selectedTimes);
  const selectedDateLabel = selectedDateKey
    ? formatCalendarDate(selectedDateKey)
    : "";

  // 선택된 날짜/시간이 바뀔 때마다 요약 카드에 보여줄 데이터 생성
  const weeklySummaryEntries = useMemo(() => {
    const entries = Object.entries(selectedTimesByDate)
      .filter(([, times]) => times.length)
      .map(([dateKey, times]) => ({
        dateKey,
        dateLabel: formatWeeklySummaryDate(dateKey),
        meta: `가능 시간 ${times.length}개`,
        times: timeSlots.filter((slot) => times.includes(slot)),
      }))
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

    return entries;
  }, [selectedTimesByDate]);

  // 다른 달(옅은 날짜)을 클릭하면 해당 월로 이동하면서 날짜 선택
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

  // 좌우 화살표로 월 전환 시 표시 월과 선택 날짜를 동시에 갱신
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

  // 동일한 시간을 다시 클릭하면 선택 해제되는 토글 로직
  const handleTimeSlotToggle = (slot: string) => {
    setSelectedTimesByDate((prev) => {
      const prevSlots = prev[selectedDateKey] ?? [];
      const isSelected = prevSlots.includes(slot);
      const nextSlots = isSelected
        ? prevSlots.filter((time) => time !== slot)
        : [...prevSlots, slot];

      const nextState = { ...prev };

      if (nextSlots.length) {
        nextState[selectedDateKey] = nextSlots;
      } else {
        delete nextState[selectedDateKey];
      }

      return nextState;
    });
  };

  return (
    <div className="prof-main-page">
      <div className="prof-main">
        <div className="prof-main__top">
          <section className="prof-card">
            <div className="prof-card__header">
              <div>
                <h2 className="prof-card__title">내 면담 가능 시간 설정</h2>
                <p className="prof-card__helper">날짜 선택</p>
              </div>
              <button type="button" className="prof-card__action">
                편집
              </button>
            </div>

            <div className="availability-card__calendar">
              <div className="calendar__header">
                <button
                  type="button"
                  className="calendar__button"
                  onClick={() => handleMonthChange(-1)}
                >
                  ‹
                </button>
                <span className="calendar__month">
                  {formatMonthLabel(visibleMonth.year, visibleMonth.month)}
                </span>
                <button
                  type="button"
                  className="calendar__button"
                  onClick={() => handleMonthChange(1)}
                >
                  ›
                </button>
              </div>

              <div className="calendar__grid">
                {dayLabels.map((day) => (
                  <span key={day} className="calendar__day-label">
                    {day}
                  </span>
                ))}
                {calendarDates.map(({ label, muted, dateKey }) => (
                  <span
                    key={dateKey}
                    className={[
                      "calendar__date",
                      muted ? "calendar__date--muted" : "",
                      dateKey === selectedDateKey
                        ? "calendar__date--active"
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

            <div className="availability-card__times">
              <p className="availability-card__caption">
                {selectedDateLabel
                  ? `${selectedDateLabel} 가능 시간`
                  : "가능 시간"}
              </p>
              <div className="time-grid">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={[
                      "time-slot",
                      selectedTimesSet.has(slot) ? "time-slot--highlight" : "",
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

            <div className="availability-card__footer">
              <span>선택된 시간: {selectedTimes.length}개</span>
              <span className="pill">가을 학기 · 상담</span>
            </div>
          </section>

          <section className="prof-card prof-card--compact">
            <div className="prof-card__header">
              <h2 className="prof-card__title">이번 주 일정 요약</h2>
            </div>
            <ul className="weekly-summary__list">
              {weeklySummaryEntries.length ? (
                weeklySummaryEntries.map((item) => (
                  <li key={item.dateKey} className="weekly-summary__item">
                    <div className="weekly-summary__label">
                      <span className="weekly-summary__date">
                        {item.dateLabel}
                      </span>
                      <span className="weekly-summary__meta">{item.meta}</span>
                    </div>
                    <div className="weekly-summary__times">
                      {item.times.map((time) => (
                        <span key={time} className="weekly-summary__time-badge">
                          {time}
                        </span>
                      ))}
                    </div>
                  </li>
                ))
              ) : (
                <li className="weekly-summary__item">
                  <div className="weekly-summary__label">
                    <span className="weekly-summary__date">
                      선택된 일정이 없습니다
                    </span>
                    <span className="weekly-summary__meta">
                      가능 시간을 선택하면 이곳에 표시돼요
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </section>
        </div>

        <section className="prof-card">
          <div className="prof-card__header">
            <div>
              <h2 className="prof-card__title">면담 요청 관리</h2>
              <p className="prof-card__helper">
                최신 면담 요청을 확인하고 상태를 관리하세요.
              </p>
            </div>
            <span className="pill pill--success">확정 1건</span>
          </div>

          <div className="request-list">
            <article className="request-item">
              <div>
                <div className="request-item__student">
                  <span className="avatar">홍</span>
                  <div className="student-info">
                    <p className="student-info__name">홍길동</p>
                    <span className="student-info__id">2020123456</span>
                    <span className="student-info__topic">학업 계획 상담</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="request-item__meta">
                  <div className="meta-row">
                    <span>희망 날짜</span>
                    <strong>2024-10-15</strong>
                  </div>
                  <div className="meta-row">
                    <span>희망 시간</span>
                    <strong>14:00</strong>
                  </div>
                  <div className="meta-row">
                    <span>면담 유형</span>
                    <strong>학업 상담</strong>
                  </div>
                </div>
                <div className="request-item__actions">
                  <button type="button" className="ghost-button">
                    메모 추가
                  </button>
                  <button type="button" className="ghost-button">
                    일정 변경
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <div className="summary-strip">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="summary-card">
              <div className="summary-card__info">
                <span className="summary-card__label">{stat.label}</span>
                <span className="summary-card__value">{stat.value}</span>
              </div>
              <span
                className={["summary-card__icon", stat.iconClass]
                  .filter(Boolean)
                  .join(" ")}
              >
                {stat.icon}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
