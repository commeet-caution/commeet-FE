import { useState } from "react";
import CardNav from "./CardNav";
import logo from "../../assets/SooMung.webp";
import LoginModal from "../../components/auth/LoginModal";
import type { User } from "../../shared/user";

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  const items = [
    // {
    //   label: "About",
    //   bgColor: "#0D0716",
    //   textColor: "#fff",
    //   links: [
    //     {
    //       label: "Company",
    //       href: "/about/company",
    //       ariaLabel: "About Company",
    //     },
    //     {
    //       label: "Careers",
    //       href: "/about/careers",
    //       ariaLabel: "About Careers",
    //     },
    //   ],
    // },
    {
      label: "Projects",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        {
          label: "student Main",
          href: "/projects/case-studies",
          ariaLabel: "Project Case Studies",
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

  const onLogout = () => setUser(undefined);

  const handleLoginSubmit = ({ role, id }: { role: string; id: number }) => {
    const newUser: User = {
      userId: id,
      name:
        role === "student"
          ? "홍길동"
          : role === "professor"
          ? "김교수"
          : "관리자",
      grade: 1,
      attendanceItems: [],
    };
    setUser(newUser);
    setLoginOpen(false);
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
        onCtaClick={() => setLoginOpen(true)}
      />
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSubmit={({ role, id }) => handleLoginSubmit({ role, id })}
      />
    </>
  );
}
