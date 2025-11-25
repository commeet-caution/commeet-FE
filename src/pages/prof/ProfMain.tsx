import { useMemo, useState } from "react";
import { formatWeeklySummaryDate } from "../../shared/calendar";
import "../../styles/common-pages.css";
import "./profMain.css";
import ProfCardCompact from "./cards/compact";
import ProfCardRequests from "./cards/requests";
import ProfCardCalendar from "./cards/calendar";

type SelectedTimesState = Record<string, string[]>;

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
] as const;

const DEFAULT_SELECTED_TIMES: SelectedTimesState = {
  "2025-10-05": ["14:00", "15:00"],
};

const summaryStats = [
  {
    icon: "📅",
    label: "이번 주 면담",
    value: "1건",
    iconClass: "",
  },
  {
    icon: "⏳",
    label: "대기 중인 요청",
    value: "0건",
    iconClass: "prof-summary-card__icon--orange",
  },
  {
    icon: "👥",
    label: "총 면담 학생",
    value: "1명",
    iconClass: "prof-summary-card__icon--blue",
  },
] as const;

export default function ProfMain() {
  const [selectedTimesByDate, setSelectedTimesByDate] =
    useState<SelectedTimesState>(
      () =>
        Object.fromEntries(
          Object.entries(DEFAULT_SELECTED_TIMES).map(([date, times]) => [
            date,
            [...times],
          ])
        ) as SelectedTimesState
    );

  /**
   * 이번 주의 일정들을 요약해줌
   * @returns 요약된 이번 주 일정 항목들
   */
  const weeklySummaryEntries = useMemo(() => {
    const entries = Object.entries(selectedTimesByDate)
      .filter(([, times]) => times.length > 0)
      .map(([dateKey, times]) => ({
        dateKey,
        dateLabel: formatWeeklySummaryDate(dateKey),
        meta: `가능 시간 ${times.length}개`,
        times: timeSlots.filter((slot) => times.includes(slot)),
      }))
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

    return entries;
  }, [selectedTimesByDate]);

  return (
    <div className="prof-page">
      <div className="prof-main">
        <div className="prof-main__top">
          <ProfCardCalendar
            selectedTimesByDate={selectedTimesByDate}
            onChangeSelectedTimes={setSelectedTimesByDate}
          />
          <ProfCardCompact weeklySummaryEntries={weeklySummaryEntries} />
        </div>

        <ProfCardRequests />

        <div className="prof-summary-strip">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="prof-summary-card">
              <div className="prof-summary-card__info">
                <span className="prof-summary-card__label">{stat.label}</span>
                <span className="prof-summary-card__value">{stat.value}</span>
              </div>
              <span
                className={["prof-summary-card__icon", stat.iconClass]
                  .filter(Boolean)
                  .join(" ")}
              >
                {stat.icon}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
