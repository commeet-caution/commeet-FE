import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import Layout from "./layout";
import * as pages from "./pages";
import { AuthProvider } from "./api/auth";

const rootElement: HTMLElement | null = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<pages.Home />} />
            <Route path="projects/profMain" element={<pages.ProfMain />} />
            <Route path="projects/studentMain" element={<pages.StudentMain />} />
            <Route path="*" element={<pages.NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
