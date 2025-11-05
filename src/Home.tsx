export default function Home() {
  return (
    <div className="landing-container">
      {/* 로컬 헤더는 숨김 (CSS로 처리됨) */}
      <header className="landing-header">
        <h1>Commeet Portal</h1>
        <nav>
          <button className="login-button">로그인</button>
        </nav>
      </header>

      {/* 히어로 문구 */}
      <main className="landing-main">
        <h2>
          상명대학교 컴퓨터과학과 <br />
          교수님들과의 면담, <br />
          더 쉽고 간편하게.
        </h2>
        <p>지금 바로 시작해보세요.</p>
      </main>

      {/* 기능 4개 */}
      <div className="quick__grid">
        <div className="quick__item">
          <div className="quick__icon">🗓️</div>
          <div className="quick__meta">
            <div className="quick__name">캘린더 연동</div>
            <div className="quick__desc">가능한 시간만 자동 표시</div>
          </div>
        </div>

        <div className="quick__item">
          <div className="quick__icon">⚡</div>
          <div className="quick__meta">
            <div className="quick__name">간편 예약·변경</div>
            <div className="quick__desc">웹에서 즉시 처리</div>
          </div>
        </div>

        <div className="quick__item">
          <div className="quick__icon">🔔</div>
          <div className="quick__meta">
            <div className="quick__name">알림 제공</div>
            <div className="quick__desc">확정/임박 리마인드</div>
          </div>
        </div>

        <div className="quick__item">
          <div className="quick__icon">👥</div>
          <div className="quick__meta">
            <div className="quick__name">교수님 선택</div>
            <div className="quick__desc">담당/희망 지도교수</div>
          </div>
        </div>
      </div>
    </div>
  );
}
