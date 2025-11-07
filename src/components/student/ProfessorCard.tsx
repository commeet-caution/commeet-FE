// ProfessorCard.tsx
import "./ProfessorCard.css"; // 교수 카드 전용 CSS (선택 사항)

type Professor = {
  id: number;
  name: string;
  major: string;
  isFavorite?: boolean;
  specialty?: string;
  office?: string;
};

type ProfessorCardProps = {
  professor: Professor;
  type: "favorite" | "list";
  // 👈 onOpenModal prop 추가: 모달을 열어줄 함수 (교수 정보를 넘겨줌)
  onOpenModal: (professor: Professor) => void;
};

export default function ProfessorCard({ professor, type, onOpenModal }: ProfessorCardProps) {
  return (
    // BEM 방식을 따라 컴포넌트의 루트 요소에 클래스명을 줍니다.
    <article className="prof-card-inner">
      <div className="prof-card-inner__header">
        <span className="prof-card-inner__avatar">
          {professor.name.charAt(0)}
        </span>
        <div>
          <h3 className="prof-card-inner__name">{professor.name}</h3>
          <p className="prof-card-inner__major">{professor.major}</p>
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
