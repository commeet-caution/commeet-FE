import { Role } from "../api/auth";

export type User = {
  userId: number;
  name: string;
  grade: number;
  role: Role;
  attendanceItems: {
    date: string;
    status: "ATTEND" | "ABSENT" | "ONLINE" | "NONE";
    reason?: string;
  }[];
};
