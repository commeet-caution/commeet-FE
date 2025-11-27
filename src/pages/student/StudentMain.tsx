// =============================================
import React from "react";
import axios from "axios";
import "./StudentMain.css";
import ProfessorCard, {
  Professor,
} from "../../components/student/ProfessorCard"; // Professor 타입 import
import ReservationItem from "../../components/student/ReservationItem";
import AppointmentModal from "../../components/student/AppointmentModal";

// 세션 쿠키를 항상 포함하도록 axios 기본값 설정
axios.defaults.withCredentials = true;

// const favoriteProfessors: Professor[] = [
//   { id: 1, name: "김교수", major: "컴퓨터공학과", isFavorite: true },
//   { id: 2, name: "이교수", major: "컴퓨터공학과", isFavorite: true },
// ];

export default function StudentMainPage() {
  // -----------------------------
  // 교수 목록 관련 상태
  // -----------------------------
  const [professors, setProfessors] = React.useState<Professor[]>([]);
  const [searchName, setSearchName] = React.useState("");
  const [searchDepartment, setSearchDepartment] = React.useState("");
  const [profLoading, setProfLoading] = React.useState(false);
  const [profError, setProfError] = React.useState<string | null>(null);

  // loadProfessors: API를 통해 교수 목록을 검색 조건에 맞게 불러옴
  const loadProfessors = React.useCallback(async () => {
    setProfLoading(true);
    setProfError(null);
    try {
      const params: { name?: string; department?: string } = {};
      if (searchName) {
        params.name = searchName;
      }
      if (searchDepartment) {
        params.department = searchDepartment;
      }

      const response = await axios.get("/api/professors", {
        params,
        withCredentials: true,
      });

      setProfessors(response.data || []);
    } catch (e) {
      setProfError("교수 목록을 불러오지 못했습니다.");
      setProfessors([]);
    } finally {
      setProfLoading(false);
    }
  }, [searchName, searchDepartment]);

  // 초기 마운트 및 검색어/학과 변경 시 교수 목록 재로딩
  React.useEffect(() => {
    loadProfessors();
  }, [loadProfessors]);

  // -----------------------------
  // 예약 모달 관련 상태
  // -----------------------------
  const [showAppointmentModal, setShowAppointmentModal] = React.useState(false);
  const [selectedProfessor, setSelectedProfessor] =
    React.useState<Professor | null>(null);

  // -----------------------------
  // 예약 목록 관련 상태 및 타입
  // -----------------------------
  type AppointmentData = {
    appointmentId: number;
    studentName: string;
    professorName: string;
    startTime: string;
    endTime?: string;
    topic: "CAREER" | "EMPLOYMENT";
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  };

  const [appointments, setAppointments] = React.useState<AppointmentData[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = React.useState(false);
  const [appointmentsError, setAppointmentsError] = React.useState<
    string | null
  >(null);

  // fetchAppointments: 학생의 예약 목록을 불러옴
  const STUDENT_ID = 7; // TODO: 로그인 사용자 ID로 치환
  const fetchAppointments = React.useCallback(async () => {
    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      const res = await axios.get(`/api/appointments/student/${STUDENT_ID}`, {
        withCredentials: true,
      });
      setAppointments(res.data || []);
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message ||
        e.message ||
        "면담 목록을 불러오지 못했습니다.";
      setAppointmentsError(errorMessage);
    } finally {
      setAppointmentsLoading(false);
    }
  }, []);

  // 마운트 시 예약 목록 로딩
  React.useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // -----------------------------
  // 핸들러 함수
  // -----------------------------

  // handleOpenAppointmentModal: 상세 정보 조회 후 모달 열기
  const handleOpenAppointmentModal = async (professor: Professor) => {
    try {
      const response = await axios.get(
        `/api/professors/${professor.professorId}`
      );
      setSelectedProfessor(response.data);
      setShowAppointmentModal(true);
    } catch (error) {
      console.error("교수 상세 정보 조회 실패:", error);
      alert("교수님의 상세 정보를 불러오는 데 실패했습니다.");
    }
  };

  // handleCloseAppointmentModal: 모달 닫고 선택 교수 초기화
  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedProfessor(null);
  };

  // handleCancelAppointment: 예약 취소 처리
  const handleCancelAppointment = async (appointmentId: number) => {
    if (!window.confirm("정말로 예약을 취소하시겠습니까?")) {
      return;
    }

    const reason = window.prompt("취소 사유를 입력해주세요. (선택)", "");

    try {
      await axios.patch(
        `/api/appointments/${appointmentId}/cancel`,
        {
          userId: STUDENT_ID,
          reason: reason?.trim() ? reason.trim() : undefined,
        },
        {
          withCredentials: true,
        }
      );
      alert("예약이 성공적으로 취소되었습니다.");
      fetchAppointments(); // 예약 목록 새로고침
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message ||
        e.message ||
        "예약 취소 중 오류가 발생했습니다.";
      alert(`오류: ${errorMessage}`);
    }
  };

  return (
    <div className="prof-main-page">
      <main className="student-main">
        {/* 교수 목록 섹션 */}
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
                key={prof.professorId}
                professor={prof}
                type="list"
                onOpenModal={handleOpenAppointmentModal}
              />
            ))}
          </div>
        </section>

        {/* 내 예약 현황 섹션 */}
        <section className="prof-card">
          <div className="prof-card__header">
            <h2 className="prof-card__title">🗓️ 내 예약 현황</h2>
          </div>
          <div className="reservation-list">
            {appointmentsLoading && <p>면담 목록 로딩중...</p>}
            {appointmentsError && (
              <p className="error-text">{appointmentsError}</p>
            )}
            {!appointmentsLoading &&
              !appointmentsError &&
              appointments.length === 0 && (
                <p className="empty-text">예약된 면담이 없습니다.</p>
              )}
            {appointments.map((a) => (
              <ReservationItem
                key={a.appointmentId}
                appointment={a}
                onCancel={handleCancelAppointment}
              />
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
