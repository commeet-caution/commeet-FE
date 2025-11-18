// StudentMainPage.tsx (수정)
import React, { useState } from "react"; // useState import
import "../../styles/common-pages.css";
import "./StudentMain.css";
import ProfessorCard from "../../components/student/ProfessorCard";
import ReservationItem from "../../components/student/ReservationItem";
import AppointmentModal from "../../components/student/AppointmentModal";
// --- 가짜 데이터 (동일) ---
const favoriteProfessors = [
  { id: 1, name: "김교수", major: "컴퓨터공학과", isFavorite: true },
  { id: 2, name: "이교수", major: "컴퓨터공학과", isFavorite: true },
];

const professorList = [
  {
    id: 3,
    name: "민경하",
    major: "컴퓨터공학과 • 조교수",
    specialty: "인공지능, 머신러닝",
    office: "공학관 301호",
  },
  {
    id: 4,
    name: "이교수",
    major: "컴퓨터공학과 • 부교수",
    specialty: "데이터베이스, 빅데이터",
    office: "공학관 305호",
  },
  {
    id: 5,
    name: "박교수",
    major: "소프트웨어학과 • 조교수",
    specialty: "웹개발, 클라우드",
    office: "IT관 202호",
  },
];

type ReservationStatus = "확정" | "대기" | "취소";
const myReservations: {
  id: number;
  profName: string;
  date: string;
  time: string;
  topic: string;
  status: ReservationStatus;
}[] = [
  {
    id: 101,
    profName: "김교수 교수님",
    date: "2024-10-15",
    time: "14:00",
    topic: "학업 계획 상담",
    status: "확정",
  },
];
// --- 가짜 데이터 끝 ---

export default function StudentMainPage() {
  // --- 모달 관련 상태 ---
  const [showAppointmentModal, setShowAppointmentModal] = useState(false); // 모달 표시 여부
  const [selectedProfessor, setSelectedProfessor] = useState<any>(null); // 현재 선택된 교수 정보

  // 모달을 여는 함수
  const handleOpenAppointmentModal = (professor: any) => {
    setSelectedProfessor(professor);
    setShowAppointmentModal(true);
  };

  // 모달을 닫는 함수
  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedProfessor(null);
  };

  return (
    <div className="prof-main-page">
      <main className="student-main">
        {/* 1. 즐겨찾기 교수 섹션 */}
        <section className="prof-card">
          <div className="prof-card__header">
            <h2 className="prof-card__title">⭐ 즐겨찾기 교수</h2>
          </div>
          <div className="professor-grid">
            {favoriteProfessors.map((prof) => (
              <ProfessorCard
                key={prof.id}
                professor={prof}
                type="favorite"
                onOpenModal={handleOpenAppointmentModal} // 👈 모달 열기 함수 전달
              />
            ))}
          </div>
        </section>

        {/* 2. 교수 목록 섹션 */}
        <section className="prof-card">
          <div className="prof-card__header">
            <h2 className="prof-card__title">🔍 교수 목록</h2>
            <span className="pill">{professorList.length}명 교수</span>
          </div>

          {/* 검색바 (기존과 동일) */}
          <div className="search-bar">
            <input
              type="text"
              className="search-bar__input"
              placeholder="교수명, 학과, 전문분야로 검색..."
            />
            <select className="search-bar__select">
              <option value="">전체 학과</option>
              <option value="컴퓨터공학과">컴퓨터공학과</option>
              <option value="소프트웨어학과">소프트웨어학과</option>
            </select>
          </div>

          {/* 교수 목록 그리드 */}
          <div className="professor-grid">
            {professorList.map((prof) => (
              <ProfessorCard
                key={prof.id}
                professor={prof}
                type="list"
                onOpenModal={handleOpenAppointmentModal} // 👈 모달 열기 함수 전달
              />
            ))}
          </div>
        </section>

        {/* 3. 내 예약 현황 섹션 (기존과 동일) */}
        <section className="prof-card">
          <div className="prof-card__header">
            <h2 className="prof-card__title">🗓️ 내 예약 현황</h2>
          </div>
          <div className="reservation-list">
            {myReservations.map((res) => (
              <ReservationItem key={res.id} reservation={res} />
            ))}
          </div>
        </section>
      </main>

      {/* 👈 모달 컴포넌트 추가 */}
      <AppointmentModal
        show={showAppointmentModal} // show 상태에 따라 모달 표시/숨김
        onClose={handleCloseAppointmentModal} // 모달 닫기 함수 전달
        professor={selectedProfessor} // 선택된 교수 정보 전달
      />
    </div>
  );
}
