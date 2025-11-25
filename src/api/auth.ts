// src/api/auth.ts
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch } from "./client";
import type { User } from "../shared/user";

// LoginModal / Header에서 함께 사용하는 역할 타입
export type Role = "student" | "professor" | "admin";

// 서버가 로그인 성공 시 내려주는 최소 사용자 정보
export interface LoginUser {
  userId: number;
  name: string;
  role: Role;
}

// LoginModal -> Header -> API로 전달되는 로그인 파라미터
export interface LoginParams {
  role: Role;
  id: number; // 학번 / 교번 / 관리자 ID
  password: string;
}

// 회원가입 시 필요한 정보 (백엔드 준비 시 사용)
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

const AuthContext = createContext<useAuthReturn | null>(null);
const STORAGE_KEY = "auth:user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as User) : undefined;
    } catch {
      return undefined;
    }
  });

  // 초기 렌더링 시 서버 세션이 있으면 사용자 정보를 복원
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await apiFetch<User>("/api/me");
        if (!cancelled) setUser(me);
      } catch {
        // 세션이 없거나 만료된 경우에는 무시
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // user 상태를 로컬 스토리지에 동기화
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // 1) 로그인
  async function loginApi(params: LoginParams): Promise<LoginUser> {
    // curl 예시와 동일하게 form-urlencoded로 전송
    const formBody = new URLSearchParams();
    formBody.append("loginId", String(params.id)); // 서버에서 받는 필드 이름
    formBody.append("password", params.password);

    return apiFetch<LoginUser>("/api/login", {
      method: "POST",
      body: formBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  }

  // 2) 회원가입 (백엔드 준비되면 연결)
  async function registerApi(params: RegisterParams): Promise<LoginUser> {
    const payload = {
      id: params.id,
      password: params.password,
      name: params.name,
      role: params.role,
    };

    return apiFetch<LoginUser>("/api/register", {
      method: "POST",
      body: payload, // 서버에서 JSON을 받도록 가정
    });
  }

  // 3) 로그아웃
  async function logoutApi(): Promise<void> {
    await apiFetch<void>("/api/logout", {
      method: "POST",
    });
  }

  const value = useMemo(
    () => ({ user, setUser, loginApi, registerApi, logoutApi }),
    [user]
  );
  return createElement(AuthContext.Provider, { value }, children);
  // return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): useAuthReturn {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("AuthProvider로 감싼 뒤에 useAuth를 사용할 수 있습니다.");
  }
  return ctx;
}
