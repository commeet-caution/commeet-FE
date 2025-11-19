// StudentMainPage.tsx (수정)
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./StudentMain.css";
import ProfessorCard, {
  Professor,
} from "../../components/student/ProfessorCard"; // Professor 타입을 import
import ReservationItem from "../../components/student/ReservationItem";
import AppointmentModal from "../../components/student/AppointmentModal";

const favoriteProfessors: Professor[] = [
  { id: 1, name: "김교수", major: "컴퓨터공학과", isFavorite: true },
  { id: 2, name: "이교수", major: "컴퓨터공학과", isFavorite: true },
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

export default function StudentMainPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );

  const fetchProfessors = useCallback(async () => {
    try {
      const params = {
        name: searchName,
        department: searchDepartment,
      };

      // const response = await axios.get("/api/professors", {
      //   params,
      //   headers: { Authorization: "Bearer {JWT}" },
      // });
      // setProfessors(response.data);

      // --- Mock API 응답 ---
      const mockProfessorList: Professor[] = [
        {
          professorId: 3,
          name: "민경하",
          department: "컴퓨터과학전공",
          email: "mkh@test.com",
          major: "컴퓨터과학전공",
          specialty: "인공지능, 머신러닝",
          office: "공학관 301호",
        },
        {
          professorId: 4,
          name: "이교수",
          department: "컴퓨터과학전공",
          email: "lee@test.com",
          major: "컴퓨터과학전공",
          specialty: "데이터베이스, 빅데이터",
          office: "공학관 305호",
        },
        {
          professorId: 5,
          name: "박교수",
          department: "휴먼AI전공",
          email: "park@test.com",
          major: "휴먼AI전공",
          specialty: "웹개발, 클라우드",
          office: "공학관 202호",
        },
      ];

      let filteredList = mockProfessorList;
      if (searchName) {
        filteredList = filteredList.filter((p) => p.name.includes(searchName));
      }
      if (searchDepartment) {
        filteredList = filteredList.filter(
          (p) => p.department === searchDepartment
        );
      }
      setProfessors(filteredList);
    } catch (error) {
      console.error("Failed to fetch professors:", error);
      setProfessors([]);
    }
  }, [searchName, searchDepartment]);

  useEffect(() => {
    fetchProfessors();
  }, [fetchProfessors]);

  const handleOpenAppointmentModal = (professor: Professor) => {
    setSelectedProfessor(professor);
    setShowAppointmentModal(true);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedProfessor(null);
  };

  return (
    <div className="prof-main-page">
      <main className="student-main">
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
                onOpenModal={handleOpenAppointmentModal}
              />
            ))}
          </div>
        </section>

        <section className="prof-card">
          <div className="prof-card__header">
            <h2 className="prof-card__title">🔍 교수 목록</h2>
            <span className="pill">{professors.length}명 교수</span>
          </div>

          <div className="search-bar">
            <input
              type="text"
              className="search-bar__input"
              placeholder="교수명으로 검색..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <select
              className="search-bar__select"
              value={searchDepartment}
              onChange={(e) => setSearchDepartment(e.target.value)}
            >
              <option value="">전체 학과</option>
              <option value="컴퓨터공학과">컴퓨터공학과</option>
              <option value="컴퓨터과학전공">컴퓨터과학전공</option>
              <option value="휴먼AI전공">휴먼AI전공</option>
            </select>
          </div>

          <div className="professor-grid">
            {professors.map((prof) => (
              <ProfessorCard
                key={prof.professorId || prof.id} // API 응답과 기존 데이터 모두 처리
                professor={prof}
                type="list"
                onOpenModal={handleOpenAppointmentModal}
              />
            ))}
          </div>
        </section>

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

      <AppointmentModal
        show={showAppointmentModal}
        onClose={handleCloseAppointmentModal}
        professor={selectedProfessor}
      />
    </div>
  );
}
