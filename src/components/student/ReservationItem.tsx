// ReservationItem.tsx
import "./ReservationItem.css";
type AppointmentStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED" | "PENDING";
type AppointmentTopic = "CAREER" | "EMPLOYMENT";

export interface AppointmentItemData {
  appointmentId: number;
  professorName: string;
  startTime: string;
  endTime: string;
  topic: AppointmentTopic;
  status: AppointmentStatus;
}

interface ReservationItemProps {
  appointment: AppointmentItemData;
  onCancel?: (appointmentId: number) => void;
}

const statusToKorean: Record<AppointmentStatus, string> = {
  CONFIRMED: "확정",
  COMPLETED: "완료",
  CANCELLED: "취소",
  PENDING: "대기",
};

const topicToKorean: Record<AppointmentTopic, string> = {
  CAREER: "진로 상담",
  EMPLOYMENT: "취업 상담",
};

const getStatusPillClass = (status: AppointmentStatus) => {
  switch (status) {
    case "CONFIRMED":
    case "COMPLETED":
      return "pill pill--success";
    case "PENDING":
      return "pill pill--warning";
    case "CANCELLED":
    default:
      return "pill";
  }
};

function formatDateAndTime(startISO: string) {
  const d = new Date(startISO);
  const date = d.toISOString().slice(0, 10); // YYYY-MM-DD
  const time = d.toTimeString().slice(0, 5); // HH:MM
  return { date, time };
}

export default function ReservationItem({
  appointment,
  onCancel,
}: ReservationItemProps) {
  const { date, time } = formatDateAndTime(appointment.startTime);
  const canCancel =
    appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED";

  return (
    <article className="reservation-item">
      <div className="reservation-item__info">
        <div>
          <span className="reservation-item__datetime">
            {date} • {time}
          </span>
          <p className="reservation-item__prof">
            {appointment.professorName} 교수님
          </p>
        </div>
        <p className="reservation-item__topic">
          {topicToKorean[appointment.topic]}
        </p>
      </div>
      <div className="reservation-item__controls">
        <span className={getStatusPillClass(appointment.status)}>
          {statusToKorean[appointment.status]}
        </span>
        {canCancel && (
          <button
            type="button"
            className="pill pill--danger reservation-item__cancel-btn"
            aria-label="예약 취소"
            onClick={() => onCancel?.(appointment.appointmentId)}
          >
            취소
          </button>
        )}
      </div>
    </article>
  );
}
