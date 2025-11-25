type ProfCardRequestsProps = {};

/**
 *
 * @param param0
 * @returns
 */
export default function ProfCardRequests({}: ProfCardRequestsProps) {
  return (
    <section className="prof-card prof-card--requests">
      <div className="prof-card__header">
        <div>
          <h2 className="prof-card__title">면담 요청 관리</h2>
          <p className="prof-card__helper">
            최신 면담 요청을 확인하고 상태를 관리하세요.
          </p>
        </div>
        <span className="prof-pill prof-pill--success">확정 1건</span>
      </div>

      <div className="prof-request-list">
        <article className="prof-request-item">
          <div>
            <div className="prof-request-item__student">
              <span className="prof-avatar">홍</span>
              <div className="prof-student-info">
                <p className="prof-student-info__name">홍길동</p>
                <span className="prof-student-info__id">2020123456</span>
                <span className="prof-student-info__topic">학업 계획 상담</span>
              </div>
            </div>
          </div>
          <div>
            <div className="prof-request-item__meta">
              <div className="prof-meta-row">
                <span>희망 날짜</span>
                <strong>2024-10-15</strong>
              </div>
              <div className="prof-meta-row">
                <span>희망 시간</span>
                <strong>14:00</strong>
              </div>
              <div className="prof-meta-row">
                <span>면담 유형</span>
                <strong>학업 상담</strong>
              </div>
            </div>
            <div className="prof-request-item__actions">
              <button type="button" className="prof-ghost-button">
                메모 추가
              </button>
              <button type="button" className="prof-ghost-button">
                일정 변경
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
