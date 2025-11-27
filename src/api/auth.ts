import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useMemo,
  useContext,
  createElement,
} from "react";
// import { apiFetch } from "./client";
import axios from "axios";
import type { User } from "../shared/user";

/**
 * 프론트엔드에서 사용하는 사용자 역할 타입
 * @typedef {"student" | "professor" | "admin"} Role
 */
export type Role = "student" | "professor" | "admin";

/**
 * 서버로 전달하는 역할 타입
 * @typedef {"ROLE_STUDENT" | "ROLE_PROFESSOR" | "ROLE_ADMIN"} ServerRole
 */
export type ServerRole = "ROLE_STUDENT" | "ROLE_PROFESSOR" | "ROLE_ADMIN";

/**
 * 로그인 성공 시 서버에서 내려주는 사용자 정보
 * @typedef {Object} LoginUser
 * @property {number} userId - 사용자 고유 ID
 * @property {string} name - 이름
 * @property {Role} role - 역할
 */
export interface LoginUser {
  userId: number;
  name: string;
  role: Role;
}

/**
 * 로그인 요청에 필요한 파라미터
 * @typedef {Object} LoginParams
 * @property {Role} role - 사용자 역할
 * @property {number} id - 학번/교번/관리자 ID
 * @property {string} password - 비밀번호
 */
export interface LoginParams {
  role: Role;
  id: string;
  password: string;
}

/**
 * 회원가입에 필요한 파라미터
 * @typedef {Object} RegisterParams
 * @property {Role} role
 * @property {string} id
 * @property {string} password
 * @property {string} name
 * @property {string} university
 * @property {string} department
 */
export interface RegisterParams {
  role: Role;
  id: string;
  password: string;
  name: string;
  university: string;
  department: string;
}

/**
 * Role → ServerRole 변환 함수
 * 서버 API 호출 시 필요한 형태로 변환합니다.
 *
 * @param {Role} role - 프론트 역할
 * @returns {ServerRole} 서버용 역할 코드
 */
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

export type useAuthReturn = {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  loginApi: (params: LoginParams) => Promise<LoginUser>;
  signUpApi: (params: RegisterParams) => Promise<void>;
  logoutApi: () => Promise<void>;
};

const AuthContext = createContext<useAuthReturn | null>(null);
const STORAGE_KEY = "auth:user";

/**
 * AuthProvider
 * 전역적으로 인증 상태(user)와 로그인/회원가입/로그아웃 API를 제공하는 Provider입니다.
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Provider가 감쌀 React 노드
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as User) : undefined;
    } catch {
      return undefined;
    }
  });

  /**
   * user 상태가 변할 때마다 localStorage에 동기화
   */
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  /**
   * 로그인 API
   *
   * @async
   * @function loginApi
   * @param {LoginParams} params - 로그인 데이터
   * @returns {Promise<LoginUser>} 로그인 성공 시 사용자 정보
   *
   * @example
   * ```ts
   * const { loginApi, setUser } = useAuth();
   * const user = await loginApi({ role: "student", id: 20230001, password: "1234" });
   * setUser(user);
   * ```
   */
  async function loginApi(params: LoginParams): Promise<LoginUser> {
    const formBody = new URLSearchParams();
    formBody.append("loginId", params.id);
    formBody.append("password", params.password);

    const response = await axios.post<LoginUser>("/api/login", formBody, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  }

  /**
   * 회원가입 API
   *
   * @async
   * @function signUpApi
   * @param {RegisterParams} params - 회원가입 정보
   * @returns {Promise<void>}
   */
  async function signUpApi(params: RegisterParams): Promise<void> {
    const body = {
      loginId: params.id,
      password: params.password,
      name: params.name,
      university: params.university,
      department: params.department,
      role: toServerRole(params.role),
    };

    const response = await axios.post<void>("/api/register", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  }

  /**
   * 로그아웃 API
   *
   * @async
   * @function logoutApi
   * @returns {Promise<void>}
   *
   * @example
   * ```ts
   * const { logoutApi, setUser } = useAuth();
   * await logoutApi();
   * setUser(undefined);
   * ```
   */
  async function logoutApi(): Promise<void> {
    const response = await axios.post<void>("/api/logout");
    return response.data;
  }

  const value = useMemo(
    () => ({ user, setUser, loginApi, signUpApi, logoutApi }),
    [user]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

/**
 * useAuth
 * AuthProvider 내부 어디서든 호출할 수 있는 인증 전용 커스텀 훅입니다.
 *
 * @returns {useAuthReturn} 인증 상태와 API 함수들
 * @throws {Error} AuthProvider 밖에서 호출했을 때 에러 발생
 *
 * @example
 * ```ts
 * const { user, loginApi, logoutApi } = useAuth();
 *
 * if (!user) {
 *   await loginApi({ role: "student", id: 1, password: "1234" });
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용 가능합니다.");
  }
  return context;
}
