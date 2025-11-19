// ProfessorCard.tsx
import "./ProfessorCard.css";

export type Professor = {
  id?: number;
  professorId?: number;
  name: string;
  major?: string;
  department?: string;
  isFavorite?: boolean;
  specialty?: string;
  office?: string;
  email?: string;
};

type ProfessorCardProps = {
  professor: Professor;
  type: "favorite" | "list";
  onOpenModal: (professor: Professor) => void;
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
          <p className="prof-card-inner__major">
            {professor.department || professor.major}
          </p>
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

      <button
        type="button"
        className="prof-card-inner__button"
        onClick={() => onOpenModal(professor)}
      >
        면담 예약
      </button>
    </article>
  );
}
