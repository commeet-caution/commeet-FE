// src/components/auth/SignupModal.tsx  (경로는 네 구조에 맞게)

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./LoginModal.css";
import logo from "../../assets/SooMung.webp";
import type { Role, RegisterParams } from "../../api/auth";
import { signUpApi } from "../../api/auth";

type SignupModalProps = {
  open: boolean;
  onClose: () => void;
  defaultRole: Role; // 현재 선택된 탭(student/professor/admin) 전달
};

export default function SignupModal({
  open,
  onClose,
  defaultRole,
}: SignupModalProps) {
  const [form, setForm] = useState<RegisterParams>({
    role: defaultRole,
    id: 0,
    password: "",
    name: "",
    university: "상명대학교",
    department: "컴퓨터과학전공",
  });
  const [loading, setLoading] = useState(false);

  // 🔥 defaultRole이 바뀌면 form.role도 자동 변경
  useEffect(() => {
    setForm(prev => ({ ...prev, role: defaultRole }));
  }, [defaultRole]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signUpApi(form);
      alert("회원가입이 완료되었습니다. 이제 로그인해 주세요.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("회원가입에 실패했습니다. 입력값이나 서버 상태를 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="modal-backdrop">
      <div className="login-modal">
        <img src={logo} alt="logo" className="login-logo" />
        <h2>회원가입</h2>
        <p className="login-subtitle">정보를 입력하고 계정을 만들어 주세요.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            역할
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="login-input"
            >
              <option value="student">학생</option>
              <option value="professor">교수</option>
              <option value="admin">관리자</option>
            </select>
          </label>

          <label className="login-label">
            학번
            <input
              name="id"
              type="number"
              className="login-input"
              placeholder="학번을 입력하세요"
              value={form.id || ""}
              onChange={handleChange}
            />
          </label>

          <label className="login-label">
            이름
            <input
              name="name"
              className="login-input"
              placeholder="이름을 입력하세요"
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label className="login-label">
            학교
            <input
              name="university"
              className="login-input"
              value={form.university}
              onChange={handleChange}
            />
          </label>

          <label className="login-label">
            학과
            <input
              name="department"
              className="login-input"
              value={form.department}
              onChange={handleChange}
            />
          </label>

          <label className="login-label">
            비밀번호
            <input
              name="password"
              type="password"
              className="login-input"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={handleChange}
            />
          </label>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>

          <button
            type="button"
            className="login-secondary-btn"
            onClick={onClose}
          >
            닫기
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

