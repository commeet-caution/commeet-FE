import { StrictMode } from "react"; // 개발용 버그 탐지용 래퍼
import { createRoot } from "react-dom/client";

// 라우팅 라이브러리
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css"; // 전역 스타일
import Layout from "./layout"; // 레이아웃 컴포넌트
import * as pages from "./pages"; // 기타 페이지 컴포넌트
// "./pages"를 import하면 자동으로 index.tsx를 참조함

// TypeScript 로 작성하기에 필요한 타입 정의
const rootElement: HTMLElement | null = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<pages.Home />} />
          <Route path="projects/profMain" element={<pages.ProfMain />} />
          <Route path="*" element={<pages.NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
