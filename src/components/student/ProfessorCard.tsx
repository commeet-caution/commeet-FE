// ProfessorCard.tsx
import "./ProfessorCard.css";

export type ProfessorSlot = {
  slotId: number;
  startTime: string; // ISO
  endTime: string; // ISO
};

export type Professor = {
  professorId: number; // 표준화: id 대신 professorId 사용
  name: string;
  department: string;
  email: string;
  profileContent?: string; // 마크다운 프로필
  availableSlots?: ProfessorSlot[]; // 상세 조회 시만 존재
  // === 기존 화면용 (있으면 표시) ===
  specialty?: string;
  office?: string;
  major?: string; // 과거 호환용 (department로 대체 예정)
};

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
          {/* API 응답(department)과 기존 데이터(major)를 모두 표시합니다. */}
          <p className="prof-card-inner__major">{professor.department}</p>
        </div>
        {type === "list" && (
          <span className="prof-card-inner__favorite-btn">⭐</span>
        )}
      </div>

      {type === "list" && (
        <div className="prof-card-inner__details">
          <p>{professor.specialty}</p>
          <p>{professor.office}</p>
        </div>
      )}

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
