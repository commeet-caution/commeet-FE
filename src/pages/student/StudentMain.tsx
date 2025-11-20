// StudentMainPage.tsx (수정)
import React from "react";
// import axios from "axios"; // 실제 API 사용 시 주석 해제
import "./StudentMain.css";
import ProfessorCard, {
  Professor,
} from "../../components/student/ProfessorCard"; // Professor 타입 import
import ReservationItem from "../../components/student/ReservationItem";
import AppointmentModal from "../../components/student/AppointmentModal";
// 교수 목록 인라인 로직 (hook 제거)

// const favoriteProfessors: Professor[] = [
//   { id: 1, name: "김교수", major: "컴퓨터공학과", isFavorite: true },
//   { id: 2, name: "이교수", major: "컴퓨터공학과", isFavorite: true },
// ];

// 면담(예약) 목록은 API 기반 훅 사용

export default function StudentMainPage() {
  // 교수 목록 상태
  const [professors, setProfessors] = React.useState<Professor[]>([]);
  const [searchName, setSearchName] = React.useState("");
  const [searchDepartment, setSearchDepartment] = React.useState("");
  const [profLoading, setProfLoading] = React.useState(false);
  const [profError, setProfError] = React.useState<string | null>(null);

  const loadProfessors = React.useCallback(() => {
    setProfLoading(true);
    setProfError(null);
    try {
      const mockProfessorList: Professor[] = [
        {
          professorId: 3,
          name: "민경하",
          department: "컴퓨터과학전공",
          specialty: "인공지능, 머신러닝",
          office: "공학관 301호",
        },
        {
          professorId: 4,
          name: "이교수",
          department: "컴퓨터과학전공",
          specialty: "데이터베이스, 빅데이터",
          office: "공학관 305호",
        },
        {
          professorId: 5,
          name: "박교수",
          department: "휴먼AI전공",
          specialty: "웹개발, 클라우드",
          office: "공학관 202호",
        },
      ];
      let filtered = mockProfessorList;
      if (searchName)
        filtered = filtered.filter((p) => p.name.includes(searchName));
      if (searchDepartment)
        filtered = filtered.filter((p) => p.department === searchDepartment);
      setProfessors(filtered);
    } catch (e) {
      setProfError("교수 목록을 불러오지 못했습니다.");
      setProfessors([]);
    } finally {
      setProfLoading(false);
    }
  }, [searchName, searchDepartment]);

  React.useEffect(() => {
    loadProfessors();
  }, [loadProfessors]);
  const [showAppointmentModal, setShowAppointmentModal] = React.useState(false);
  const [selectedProfessor, setSelectedProfessor] =
    React.useState<Professor | null>(null);
  // === 면담(예약) 목록 인라인 구현 (hook 제거) ===
  type Appointment = {
    appointmentId: number;
    studentName: string;
    professorName: string;
    startTime: string; // ISO
    endTime: string; // ISO
    topic: "CAREER" | "EMPLOYMENT";
    status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "PENDING";
  };

  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = React.useState(false);
  const [appointmentsError, setAppointmentsError] = React.useState<
    string | null
  >(null);

  const MOCK_APPOINTMENTS: Appointment[] = [
    {
      appointmentId: 1001,
      studentName: "김학생",
      professorName: "박교수",
      startTime: "2025-11-10T14:00:00",
      endTime: "2025-11-10T14:30:00",
      topic: "CAREER",
      status: "CONFIRMED",
    },
    {
      appointmentId: 1005,
      studentName: "김학생",
      professorName: "이교수",
      startTime: "2025-11-15T11:00:00",
      endTime: "2025-11-15T11:30:00",
      topic: "EMPLOYMENT",
      status: "COMPLETED",
    },
  ];

  const fetchAppointments = React.useCallback(async () => {
    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      // 실제 API 호출로 교체 가능
      // const res = await fetch(`/api/appointments/student/${studentId}`);
      // if (!res.ok) throw new Error('failed');
      // const data: Appointment[] = await res.json();
      // setAppointments(data);
      setAppointments(MOCK_APPOINTMENTS);
    } catch (e) {
      setAppointmentsError("면담 목록을 불러오지 못했습니다.");
      setAppointments(MOCK_APPOINTMENTS); // 실패 시에도 모의 데이터 표시
    } finally {
      setAppointmentsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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
        {/* 즐겨찾기 컨테이너 */}
        {/* <section className="prof-card">
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
        </section> */}

        <section className="prof-card">
          <div className="prof-card__header">
            <h2 className="prof-card__title">🔍 교수 목록</h2>
            <span className="pill">
              {profLoading
                ? "로딩중"
                : profError
                ? "오류"
                : `${professors.length}명 교수`}
            </span>
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
              <option value="컴퓨터과학전공">컴퓨터과학전공</option>
              <option value="휴먼AI전공">휴먼AI전공</option>
            </select>
          </div>

          <div className="professor-grid">
            {profError && <p className="error-text">{profError}</p>}
            {!profError && professors.length === 0 && !profLoading && (
              <p className="empty-text">검색 결과가 없습니다.</p>
            )}
            {professors.map((prof) => (
              <ProfessorCard
                key={prof.professorId || prof.id}
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
            {appointmentsLoading && <p>면담 목록 로딩중...</p>}
            {appointmentsError && (
              <p className="error-text">{appointmentsError}</p>
            )}
            {!appointmentsLoading && appointments.length === 0 && (
              <p className="empty-text">예약된 면담이 없습니다.</p>
            )}
            {appointments.map((a) => (
              <ReservationItem key={a.appointmentId} appointment={a} />
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
