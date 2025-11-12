// ReservationItem.tsx
import "./ReservationItem.css"; // 예약 아이템 전용 CSS (선택 사항)

type Reservation = {
  id: number;
  profName: string;
  date: string;
  time: string;
  topic: string;
  status: "확정" | "대기" | "취소";
};

// 팀원 코드의 .pill 스타일을 가져와서 상태 태그로 활용
const getStatusPillClass = (status: Reservation["status"]) => {
  switch (status) {
    case "확정":
      return "pill pill--success";
    case "대기":
      return "pill pill--warning";
    case "취소":
    default:
      return "pill"; // 기본 회색
  }
};

export default function ReservationItem({
  reservation,
}: {
  reservation: Reservation;
}) {
  return (
    <article className="reservation-item">
      <div className="reservation-item__info">
        <div>
          <span className="reservation-item__datetime">
            {reservation.date} • {reservation.time}
          </span>
          <p className="reservation-item__prof">{reservation.profName}</p>
        </div>
        <p className="reservation-item__topic">{reservation.topic}</p>
      </div>
      <div className="reservation-item__controls">
        <span className={getStatusPillClass(reservation.status)}>
          {reservation.status}
        </span>
        {reservation.status !== "취소" && (
          <button type="button" className="reservation-item__button--cancel">
            ❌
          </button>
        )}
      </div>
    </article>
  );
}
