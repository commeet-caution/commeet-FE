export type User = {
  userId: number;
  name: string;
  grade: number;
  attendanceItems: {
    date: string;
    status: "ATTEND" | "ABSENT" | "ONLINE" | "NONE";
    reason?: string;
  }[];
};
