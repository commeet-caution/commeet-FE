// ReservationItem.tsx
// =============================================
// 단일 면담(예약) 목록 항목 표시 컴포넌트
// - 예약 일시/교수명/주제/상태 배지 출력
// - 취소 가능한 상태(CONFIRMED, PENDING)에서 취소 버튼 노출
// - onCancel 콜백을 통해 상위 컴포넌트가 실제 취소 로직 처리
// =============================================
import "./ReservationItem.css";
// 상태/주제 enum 타입 (간단 문자열 리터럴로 정의)
type AppointmentStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED" | "PENDING";
type AppointmentTopic = "CAREER" | "EMPLOYMENT";

// AppointmentItemData: 상위에서 전달받는 예약 데이터 구조
export interface AppointmentItemData {
  appointmentId: number;
  professorName: string;
  startTime: string;
  endTime?: string; // 명세상 필수 아님, 슬롯 길이 표시용 선택적
  topic: AppointmentTopic;
  status: AppointmentStatus;
}

// 컴포넌트 Props
// onCancel: 취소 버튼 클릭 시 호출 (선택적)
interface ReservationItemProps {
  appointment: AppointmentItemData;
  onCancel?: (appointmentId: number) => void;
}

// 상태 한국어 변환 맵
const statusToKorean: Record<AppointmentStatus, string> = {
  CONFIRMED: "확정",
  COMPLETED: "완료",
  CANCELLED: "취소",
  PENDING: "대기",
};

// 주제 한국어 변환 맵
const topicToKorean: Record<AppointmentTopic, string> = {
  CAREER: "진로 상담",
  EMPLOYMENT: "취업 상담",
};

// 상태에 따른 pill CSS 클래스 결정
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

// formatDateAndTime: ISO 문자열에서 날짜/시간(YYYY-MM-DD / HH:MM) 추출
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
