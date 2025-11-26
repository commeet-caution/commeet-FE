import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./LoginModal.css";
import logo from "../../assets/SooMung.webp";
import type { Role, LoginParams } from "../../api/auth";
import SignupModal from "./SignupModal";

export type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (params: LoginParams) => void | Promise<void>;
};

const roleLabels: Record<Role, string> = {
  ROLE_STUDENT: "학생",
  ROLE_PROFESSOR: "교수",
  ROLE_ADMIN: "관리자",
};

export default function LoginModal({
  open,
  onClose,
  onSubmit,
}: LoginModalProps) {
  const [role, setRole] = useState<Role>("ROLE_STUDENT");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false); // ✅ 회원가입 모달 on/off
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const root = useMemo(() => document.body, []);
  if (!open) return null;

  const loginLabel = `${roleLabels[role]} 로그인`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit?.({ role, id, password });
  };

  return (
    <>
      {createPortal(
        <div
          className="login-modal-overlay"
          ref={overlayRef}
          onClick={handleOverlayClick}
        >
          <div
            className="login-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
          >
            <img src={logo} alt="서비스 로고" className="login-logo" />
            <h2 className="login-title" id="login-title">
              교수 면담 예약 시스템
            </h2>
            <p className="login-subtitle">로그인하여 시스템을 이용해보세요</p>

            <form className="login-card" onSubmit={submit}>
              <div
                className="role-tabs"
                role="tablist"
                aria-label="로그인 유형 선택"
              >
                {(
                  ["ROLE_STUDENT", "ROLE_PROFESSOR", "ROLE_ADMIN"] as Role[]
                ).map((r) => (
                  <button
                    key={r}
                    type="button"
                    role="tab"
                    aria-selected={role === r}
                    className={`role-tab ${role === r ? "active" : ""}`}
                    onClick={() => setRole(r)}
                  >
                    {roleLabels[r]}
                  </button>
                ))}
              </div>

              <label className="field-label" htmlFor="login-id">
                {role === "ROLE_STUDENT"
                  ? "학번"
                  : role === "ROLE_PROFESSOR"
                  ? "교번"
                  : "관리자 ID"}
              </label>
              <input
                id="login-id"
                className="text-input"
                placeholder={`${
                  role === "ROLE_STUDENT"
                    ? "학번"
                    : role === "ROLE_PROFESSOR"
                    ? "교번"
                    : "관리자 ID"
                }을 입력하세요`}
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />

              <label className="field-label" htmlFor="login-password">
                비밀번호
              </label>
              <input
                id="login-password"
                className="text-input"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="login-submit" type="submit">
                {`➜ ${loginLabel}`}
              </button>
            </form>

            {/* ✅ 회원가입 버튼 */}
            <div className="login-footer-bottom">
              <span>아직 계정이 없으신가요?</span>
              <button
                type="button"
                className="signup-link"
                onClick={() => setShowSignup(true)}
              >
                회원가입
              </button>
            </div>

            <div className="login-help">
              문의사항이 있으시면 시스템 관리자에게 연락해주세요.
              <div>Email: 12go13go@naver.com</div>
            </div>
          </div>
        </div>,
        root
      )}

      {/* ✅ 회원가입 모달 렌더링 */}
      <SignupModal
        open={showSignup}
        onClose={() => setShowSignup(false)}
        defaultRole={role}
      />
    </>
  );
}
