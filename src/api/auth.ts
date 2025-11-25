// src/api/auth.ts
import { useState } from "react";
import { apiFetch } from "./client";
import type { User } from "../shared/user";

// LoginModal / Header에서 함께 쓸 역할 타입
export type Role = "student" | "professor" | "admin";

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

// 회원가입 필요 시 사용 (일단 틀만 만들어 둠)
export interface RegisterParams {
  role: Role;
  id: number;
  password: string;
  name: string;
}

export type useAuthReturn = {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  loginApi: (params: LoginParams) => Promise<LoginUser>;
  registerApi: (params: RegisterParams) => Promise<LoginUser>;
  logoutApi: () => Promise<void>;
};

export function useAuth(): useAuthReturn {
  const [user, setUser] = useState<User | undefined>(undefined);

  // 1) 로그인
  async function loginApi(params: LoginParams): Promise<LoginUser> {
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

  // 2) 회원가입 (엔드포인트 준비되면 사용)
  async function registerApi(params: RegisterParams): Promise<LoginUser> {
    const payload = {
      id: params.id,
      password: params.password,
      name: params.name,
      role: params.role,
    };

    return apiFetch<LoginUser>("/api/register", {
      method: "POST",
      body: payload, // 이쪽은 계속 JSON 전송
    });
  }

  // 3) 로그아웃
  async function logoutApi(): Promise<void> {
    await apiFetch<void>("/api/logout", {
      method: "POST",
    });
  }

  return { user, setUser, loginApi, registerApi, logoutApi };
}
