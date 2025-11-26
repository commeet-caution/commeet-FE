import { apiFetch } from "./client";

// 프론트에서 쓰는 역할 타입
export type Role = "student" | "professor" | "admin";

// 서버에 보내는 역할 타입
export type ServerRole = "ROLE_STUDENT" | "ROLE_PROFESSOR" | "ROLE_ADMIN";

// 서버에서 로그인 성공 시 내려줄 정보 (예시)
export interface LoginUser {
  userId: number;
  name: string;
  role: Role;
}

// LoginModal -> Header -> API 로 넘어가는 파라미터
export interface LoginParams {
  role: Role;
  id: number; // 학번 / 교번 / 관리자 ID
  password: string;
}

// 회원가입 시 프론트에서 모을 파라미터
export interface RegisterParams {
  role: Role;        // "student" | "professor" | "admin"
  id: number;        // 학번
  password: string;
  name: string;
  university: string;
  department: string;
}

// Role → ServerRole 매핑 함수
function toServerRole(role: Role): ServerRole {
  switch (role) {
    case "student":
      return "ROLE_STUDENT";
    case "professor":
      return "ROLE_PROFESSOR";
    case "admin":
      return "ROLE_ADMIN";
  }
}

// 1) 로그인
export async function loginApi(params: LoginParams): Promise<LoginUser> {
  // curl 예시와 동일하게 form-urlencoded로 전송
  const formBody = new URLSearchParams();
  formBody.append("loginId", String(params.id)); // 서버가 받는 필드 이름
  formBody.append("password", params.password);

  return apiFetch<LoginUser>("/api/login", {
    method: "POST",
    body: formBody,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

// 2) 회원가입
export async function signUpApi(params: RegisterParams): Promise<void> {
  const body = {
    loginId: String(params.id),
    password: params.password,
    name: params.name,
    university: params.university,
    department: params.department,
    role: toServerRole(params.role),  // "student" → "ROLE_STUDENT"
  };

  return apiFetch<void>("/api/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// src/api/auth.ts

/* ... 위에 Role, ServerRole, LoginUser, LoginParams, RegisterParams,
       toServerRole, loginApi, signUpApi 까지는 네가 보낸 그대로 두고 ... */

// 3) 🔵 로그아웃 API (index.tsx에서 import 하는 함수)
export async function logoutApi(): Promise<void> {
  return apiFetch<void>("/api/logout", {
    method: "POST",
  });
}
