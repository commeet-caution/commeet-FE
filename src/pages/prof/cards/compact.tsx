type ProfCardCompactProps = {
  weeklySummaryEntries: {
    dateKey: string;
    dateLabel: string;
    meta: string;
    times: string[];
  }[];
};

/**
 *
 * @param weeklySummaryEntries 요약된 일정 항목들
 * @returns
 */
export default function ProfCardCompact({
  weeklySummaryEntries,
}: ProfCardCompactProps) {
  return (
    <section className="prof-card prof-card--compact">
      <div className="prof-card__header">
        <h2 className="prof-card__title">이번 주 일정 요약</h2>
      </div>
      <ul className="prof-weekly-summary__list">
        {weeklySummaryEntries.length ? (
          weeklySummaryEntries.map((item) => (
            <li key={item.dateKey} className="prof-weekly-summary__item">
              <div className="prof-weekly-summary__label">
                <span className="prof-weekly-summary__date">
                  {item.dateLabel}
                </span>
                <span className="prof-weekly-summary__meta">{item.meta}</span>
              </div>
              <div className="prof-weekly-summary__times">
                {item.times.map((time) => (
                  <span key={time} className="prof-weekly-summary__time-badge">
                    {time}
                  </span>
                ))}
              </div>
            </li>
          ))
        ) : (
          <li className="prof-weekly-summary__item">
            <div className="prof-weekly-summary__label">
              <span className="prof-weekly-summary__date">
                선택된 일정이 없습니다
              </span>
              <span className="prof-weekly-summary__meta">
                가능 시간을 선택하면 이곳에 표시돼요
              </span>
            </div>
          </li>
        )}
      </ul>
    </section>
  );
}
