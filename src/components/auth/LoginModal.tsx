sdimport React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./LoginModal.css";
import logo from "../../assets/SooMung.webp";

type Role = "student" | "professor" | "admin";

export type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (params: {
    role: Role;
    id: number;
    password: string;
  }) => void | Promise<void>;
};

const roleLabels: Record<Role, string> = {
  student: "학생",
  professor: "교수",
  admin: "관리자",
};

export default function LoginModal({
  open,
  onClose,
  onSubmit,
}: LoginModalProps) {
  const [role, setRole] = useState<Role>("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
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
    await onSubmit?.({ role, id: Number(id), password });
  };

  return createPortal(
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
            {(["student", "professor", "admin"] as Role[]).map((r) => (
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
            {role === "student"
              ? "학번"
              : role === "professor"
              ? "교번"
              : "관리자 ID"}
          </label>
          <input
            id="login-id"
            className="text-input"
            placeholder={`${
              role === "student"
                ? "학번"
                : role === "professor"
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

          <button
            className="login-submit"
            type="submit"
          >{`➜ ${loginLabel}`}</button>
        </form>

        <div className="login-help">
          문의사항이 있으시면 시스템 관리자에게 연락해주세요.
          <div>Tel: 02-1234-5678 | Email: contact@commeet.com</div>
        </div>
      </div>
    </div>,
    root
  );
}
