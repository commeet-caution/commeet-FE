import { useState } from "react";
import CardNav from "./CardNav";
import logo from "../../assets/SooMung.webp";
import LoginModal from "../../components/auth/LoginModal";
import type { User } from "../../shared/user";

// 🔽 추가: 로그인/로그아웃 API, 타입 import
import { type Role, type LoginUser, useAuth } from "../../api/auth";

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  // 커스텀 훅
  const { user, setUser, loginApi, logoutApi } = useAuth();

  const items = [
    {
      label: "Projects",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        {
          label: "Student Main",
          href: "/projects/studentMain",
          ariaLabel: "Project Student Main Page",
        },
        {
          label: "Prof Main",
          href: "/projects/profMain",
          ariaLabel: "Professor Main Page",
        },
      ],
    },
    {
      label: "코드 구경하기",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/commeet-caution/commeet-FE",
          ariaLabel: "Visit our GitHub repository",
        },
      ],
    },
  ];

  // 🔁 수정: 로그아웃 시 서버에도 요청 보내기
  const onLogout = async () => {
    try {
      await logoutApi(); // 세션 제거
    } catch (e) {
      console.error(e);
    } finally {
      setUser(undefined); // 프론트 상태 초기화
    }
  };

  // 🔁 수정: 가짜 유저 생성 → 로그인 API 연동
  const handleLoginSubmit = async ({
    role,
    id,
    password,
  }: {
    role: Role;
    id: string;
    password: string;
  }) => {
    try {
      // 1) 서버에 로그인 요청
      const loginUser: LoginUser = await loginApi({ role, id, password });

      // 2) 서버 응답값을 기존 User 타입으로 매핑
      const newUser: User = {
        userId: loginUser.userId,
        name: loginUser.name,
        role: loginUser.role,
        grade: 1, // 아직 서버에서 안 온다면 임시 값 (필요시 수정)
        attendanceItems: [],
      };

      setUser(newUser);
      setLoginOpen(false);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <>
      <CardNav
        logo={logo}
        logoAlt="Company Logo"
        items={items}
        baseColor="#fff"
        menuColor="#0E207F"
        buttonBgColor="#0E207F"
        buttonTextColor="#fff"
        ease="power3.out"
        user={user}
        onLogout={onLogout}
        onCtaClick={() => setLoginOpen(true)} // "시작하기" 버튼 → 로그인 모달 열기
      />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        // 🔁 수정: 이제 password까지 포함해서 그대로 넘겨줌
        onSubmit={handleLoginSubmit}
      />
    </>
  );
}
