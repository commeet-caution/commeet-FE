// ProfessorCard.tsx
// =============================================
// 단일 교수 카드 컴포넌트
// - 교수의 기본 정보(이름, 학과/전공, 전문분야, 연구실) 표시
// - 목록 타입(type === 'list')에서 즐겨찾기 표시 및 예약 버튼 제공
// - 예약 버튼 클릭 시 상위로 onOpenModal 콜백 전달
// =============================================
import "./ProfessorCard.css";

// ProfessorSlot: 교수의 개별 가능 시간 슬롯(면담 예약 가능 구간)
export type ProfessorSlot = {
  slotId: number;
  startTime: string; // ISO
  endTime: string; // ISO
};

// Professor: 교수 엔티티(간소화된 API 응답 형태)
// availableSlots는 상세 조회 시에만 포함될 수 있음
export type Professor = {
  professorId: number; // 표준화: id 대신 professorId 사용
  name: string;
  department: string;
  email: string;
  profileContent?: string; // 마크다운 프로필
  availableSlots?: ProfessorSlot[]; // 상세 조회 시만 존재
  specialty?: string;
  office?: string;
  // major?: string; // 과거 호환용 (department로 대체 예정)
};

// props 정의
// type: 현재 'list'만 사용 중 (확장 가능성 대비)
// onOpenModal: 예약 모달 열기 위한 상위 콜백 (선택적)
type ProfessorCardProps = {
  professor: Professor;
  type: "list";
  onOpenModal?: (professor: Professor) => void; // 선택적으로 전달 (목록만 표시 용도 지원)
};

export default function ProfessorCard({
  professor,
  type,
  onOpenModal,
}: ProfessorCardProps) {
  return (
    <article className="prof-card-inner">
      <div className="prof-card-inner__header">
        <div>
          <h3 className="prof-card-inner__name">{professor.name}</h3>
          <p className="prof-card-inner__department">{professor.department}</p>
          <p className="prof-card-inner__department">{professor.email}</p>
          {/* <p className="prof-card-inner__department">{professor.profileContent}</p> */}
        </div>
        {/* 즐겨찾기 기능 주석처리 */}
        {/* {type === "list" && (
          <span className="prof-card-inner__favorite-btn">⭐</span>
        )} */}
      </div>

      {/* specialty, 사무실 관련 코드 주석처리 */}
      {/* {type === "list" && (
        <div className="prof-card-inner__details">
          <p>{professor.specialty}</p>
          <p>{professor.office}</p>
        </div>
      )} */}

      {onOpenModal && (
        <button
          type="button"
          className="prof-card-inner__button"
          onClick={() => onOpenModal(professor)}
        >
          면담 예약
        </button>
      )}
    </article>
  );
}
