import "./profMain.css";

const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

type calendarDatesType = {
  label: string;
  muted?: boolean;
  active?: boolean;
};

const calendarDates = [
  { label: "28", muted: true },
  { label: "29", muted: true },
  { label: "30", muted: true },
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "4" },
  { label: "5", active: true },
  { label: "6" },
  { label: "7" },
  { label: "8" },
  { label: "9" },
  { label: "10" },
  { label: "11" },
  { label: "12" },
  { label: "13" },
  { label: "14" },
  { label: "15" },
  { label: "16" },
  { label: "17" },
  { label: "18" },
  { label: "19" },
  { label: "20" },
  { label: "21" },
  { label: "22" },
  { label: "23" },
  { label: "24" },
  { label: "25" },
  { label: "26" },
  { label: "27" },
  { label: "28" },
  { label: "29" },
  { label: "30" },
  { label: "31" },
  { label: "1", muted: true },
  { label: "2", muted: true },
] as const;

const timeSlots = [
  "10:00",
  "09:00",
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

const weeklySchedule = [
  {
    date: "10월 15일 (화)",
    meta: "가능 시간 3개",
    times: ["10:00", "14:00", "15:00"],
  },
  {
    date: "10월 16일 (수)",
    meta: "가능 시간 3개",
    times: ["09:00", "10:00", "16:00"],
  },
  {
    date: "10월 17일 (목)",
    meta: "가능 시간 3개",
    times: ["13:00", "14:00", "17:00"],
  },
] as const;

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
                <button type="button" className="calendar__button">
                  ‹
                </button>
                <span className="calendar__month">October 2025</span>
                <button type="button" className="calendar__button">
                  ›
                </button>
              </div>

              <div className="calendar__grid">
                {dayLabels.map((day) => (
                  <span key={day} className="calendar__day-label">
                    {day}
                  </span>
                ))}
                {calendarDates.map(
                  ({ label, muted, active }: calendarDatesType, index) => (
                    <span
                      key={`${label}-${index}`}
                      className={[
                        "calendar__date",
                        muted ? "calendar__date--muted" : "",
                        active ? "calendar__date--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {label}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="availability-card__times">
              <p className="availability-card__caption">
                2025. 10. 5. 가능 시간
              </p>
              <div className="time-grid">
                {timeSlots.map((slot) => (
                  <span
                    key={slot}
                    className={[
                      "time-slot",
                      slot === "14:00" || slot === "15:00"
                        ? "time-slot--highlight"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>

            <div className="availability-card__footer">
              <span>선택된 시간: 0개</span>
              <span className="pill">가을 학기 · 상담</span>
            </div>
          </section>

          <section className="prof-card prof-card--compact">
            <div className="prof-card__header">
              <h2 className="prof-card__title">이번 주 일정 요약</h2>
            </div>
            <ul className="weekly-summary__list">
              {weeklySchedule.map((item) => (
                <li key={item.date} className="weekly-summary__item">
                  <div className="weekly-summary__label">
                    <span className="weekly-summary__date">{item.date}</span>
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
              ))}
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
