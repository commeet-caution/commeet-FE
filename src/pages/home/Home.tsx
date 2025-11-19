import "./index.css";
import CodeTyping from "../../components/landing/CodeTyping";
import ConnectionTimeline from "../../components/landing/ConnectionTimeline";


export default function Home() {
  return (
    <div className="landing-container fade-in">

      {/* 코드 타이핑 영역 */}
      <section className="hero-code">
        <CodeTyping />
      </section>

      {/* 메인 히어로 문구 */}
      <main className="landing-main">
        <h2>
          학생·교수 모두를 위한 <br />
          스마트 면담 예약 시스템
        </h2>
        <p>
          지금 가능한 시간을 한눈에 확인하고, <br />
          원하는 교수님과 즉시 면담을 예약하세요.
        </p>
      </main>

      {/* 역할 선택 박스 */}
      <div className="role-select">
        <div className="role-card">
          <div className="role-icon">👨‍🎓</div>
          <div className="role-title">학생</div>
        </div>

        <div className="role-card">
          <div className="role-icon">🖥️</div>
          <div className="role-title">서버</div>
        </div>

        <div className="role-card">
          <div className="role-icon">👩‍🏫</div>
          <div className="role-title">교수님</div>
        </div>
      </div>

      {/* 빠른 기능 설명 박스 */}
      <div className="quick__grid">
        <div className="quick__item">
          <div className="quick__icon">📅</div>
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
