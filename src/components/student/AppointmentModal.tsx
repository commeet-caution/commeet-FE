import React, { useState } from "react";
import "./Modal.css";
import axios from "axios";
import {
  buildCalendarDates,
  dayLabels,
  formatMonthLabel,
  parseIsoDate,
} from "../../shared/calendar";
import { Professor } from "./ProfessorCard";

// --- 컴포넌트가 받을 Props 타입 정의 ---
interface AppointmentModalProps {
  show: boolean; // 모달을 보여줄지 말지 결정하는 boolean 값
  onClose: () => void; // 모달 닫기 함수
  professor: Professor | null; // 선택된 교수가 없을 수도 있으므로 null 허용
}

// --- 모달 컴포넌트 시작 ---
export default function AppointmentModal({
  show,
  onClose,
  professor,
}: AppointmentModalProps) {
  // --- 상태 관리 ---
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 표시 월 (1일 기준)
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null); // ISO 문자열로 선택 날짜
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // 사용자가 선택한 시간 (토글을 위해 null 가능)
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null); // 사용자가 선택한 시간의 슬롯 ID
  const [topic, setTopic] = useState(""); // 면담 주제 (API의 topic enum: CAREER, EMPLOYMENT)
  const [studentMessage, setStudentMessage] = useState(""); // 교수에게 보낼 메시지

  // TODO: API에서 받아올 실제 예약 가능 시간 목록 (slotId 포함)
  const availableMorningTimes = [
    { time: "09:00", slotId: 101 },
    { time: "10:00", slotId: 102 },
    { time: "11:00", slotId: 103 },
  ];
  const availableAfternoonTimes = [
    { time: "13:00", slotId: 201 },
    { time: "14:00", slotId: 202 },
    { time: "15:00", slotId: 203 },
    { time: "16:00", slotId: 204 },
    { time: "17:00", slotId: 205 },
  ];

  // 캘린더 계산
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11
  const calendarDates = buildCalendarDates(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 오늘 날짜의 자정

  // show prop이 false면 아무것도 렌더링하지 않음
  if (!show || !professor) {
    return null;
  }

  // --- 이벤트 핸들러 ---
  const handleDateClick = (dateKey: string, muted: boolean) => {
    const dateObj = parseIsoDate(dateKey);
    if (dateObj < today) return;

    // muted(앞/뒤 달) 클릭 시 해당 달로 이동 후 선택
    if (muted) {
      setCurrentDate(new Date(dateObj.getFullYear(), dateObj.getMonth(), 1));
    }

    setSelectedDateKey(dateKey);
    setSelectedTime(null); // 날짜 변경 시 시간 초기화
    setSelectedSlotId(null); // 날짜 변경 시 슬롯 ID 초기화
    // TODO: 날짜별 가능 시간 재조회 로직 추가
  };

  /** 시간 버튼 토글 함수 */
  const handleTimeClick = (time: string, slotId: number) => {
    // 만약 이미 선택된 시간을 다시 클릭했다면,
    if (selectedTime === time) {
      setSelectedTime(null); // 선택을 해제합니다 (토글 Off)
      setSelectedSlotId(null);
    } else {
      // 그렇지 않다면, (새로운 시간을) 선택합니다.
      setSelectedTime(time);
      setSelectedSlotId(slotId);
    }
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(
      currentDate.getMonth() + (direction === "next" ? 1 : -1),
      1
    ); // 1일로 설정하여 월 변경 오류 방지
    setCurrentDate(newDate);
    setSelectedDateKey(null); // 월이 바뀌면 선택된 날짜 초기화
    setSelectedTime(null); // 선택된 시간 초기화
    setSelectedSlotId(null); // 선택된 슬롯 ID 초기화
  };

  const handleSubmit = async () => {
    if (!selectedSlotId || !topic) {
      alert("날짜, 시간, 면담 주제를 모두 선택해주세요.");
      return;
    }

    // API 명세서에 맞춰 데이터 구성
    const appointmentData = {
      student_id: 2020123456, // TODO: 실제 로그인된 학생 ID로 교체해야 함
      slotId: selectedSlotId,
      topic: topic, // "CAREER" 또는 "EMPLOYMENT"
      studentMessage: studentMessage,
    };

    try {
      // API 호출 (엔드포인트는 예시입니다. 실제 주소로 변경하세요)
      const response = await axios.post(
        "/api/appointments/",
        appointmentData,
        {
          headers: {
            Authorization: "Bearer {JWT}", // TODO: 실제 JWT 토큰으로 교체해야 합니다.
          },
        }
      );
      console.log("면담 예약 성공:", response.data);
      alert("면담 예약이 성공적으로 완료되었습니다.");
      onClose(); // 모달 닫기
      // TODO: 예약 완료 후, '내 예약 현황' 목록을 새로고침하는 로직 호출
    } catch (error) {
      console.error("면담 예약 실패:", error);
      alert("면담 예약에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 모달 오버레이 클릭 시 닫기 (모달 컨텐츠 클릭 시에는 닫히지 않도록 stopPropagation)
  const handleOverlayClick = () => {
    onClose();
  };
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 중단
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={handleContentClick}>
        {/* === 모달 헤더 === */}
        <div className="modal-header">
          <h3 className="modal-title">{professor.name} 교수님 면담 예약</h3>
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {/* === 모달 본문 (스크롤 영역) === */}
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">학생 이름</label>
            <input type="text" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">학번</label>
            <input type="text" className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="appointmentTopic">
              면담 주제
            </label>
            <select
              id="appointmentTopic"
              className="form-select"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="">면담 주제를 선택하세요</option>
              <option value="CAREER">진로 상담</option>
              <option value="EMPLOYMENT">취업 상담</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">희망 날짜</label>
            <div className="calendar-container">
              <div className="calendar-header">
                <button
                  className="calendar-nav-button"
                  onClick={() => handleMonthChange("prev")}
                >
                  &lt;
                </button>
                <span>{formatMonthLabel(year, month)}</span>
                <button
                  className="calendar-nav-button"
                  onClick={() => handleMonthChange("next")}
                >
                  &gt;
                </button>
              </div>
              <div className="calendar-grid">
                {dayLabels.map((d) => (
                  <span key={d} className="calendar-day-name">
                    {d === "Su"
                      ? "일"
                      : d === "Mo"
                      ? "월"
                      : d === "Tu"
                      ? "화"
                      : d === "We"
                      ? "수"
                      : d === "Th"
                      ? "목"
                      : d === "Fr"
                      ? "금"
                      : "토"}
                  </span>
                ))}
                {calendarDates.map(({ label, dateKey, muted }) => {
                  const dateObj = parseIsoDate(dateKey);
                  const isPast = dateObj < today;
                  const isSelected = selectedDateKey === dateKey;
                  return (
                    <span
                      key={dateKey}
                      className={[
                        "calendar-date",
                        muted ? "muted" : "current-month",
                        isPast ? "disabled" : "",
                        isSelected ? "selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => handleDateClick(dateKey, muted)}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 날짜가 선택되었을 때만 시간 선택 영역 표시 */}
          {selectedDateKey && (
            <div className="form-group">
              <label className="form-label">희망 시간</label>
              <div className="time-slot-group">
                <p className="time-slot-group__label">오전</p>
                <div className="time-slot-grid">
                  {availableMorningTimes.map(({ time, slotId }) => (
                    <button
                      key={time}
                      className={`time-slot-button ${
                        selectedTime === time ? "selected" : ""
                      }`}
                      onClick={() => handleTimeClick(time, slotId)}
                      // TODO: 이미 예약된 시간은 disabled 처리
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <p className="time-slot-group__label mt-4">오후</p>
                <div className="time-slot-grid">
                  {availableAfternoonTimes.map(({ time, slotId }) => (
                    <button
                      key={time}
                      className={`time-slot-button ${
                        selectedTime === time ? "selected" : ""
                      }`}
                      onClick={() => handleTimeClick(time, slotId)}
                      // TODO: 이미 예약된 시간은 disabled 처리
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">교수에게 보낼 메시지 (선택)</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="교수님께 전달할 메시지가 있다면 입력해주세요."
              value={studentMessage}
              onChange={(e) => setStudentMessage(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* === 모달 푸터 === */}
        <div className="modal-footer">
          <button
            type="button"
            className="modal-action-button modal-action-button--cancel"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="modal-action-button modal-action-button--confirm"
            onClick={handleSubmit}
          >
            예약 신청
          </button>
        </div>
      </div>
    </div>
  );
}
