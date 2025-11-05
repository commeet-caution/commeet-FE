import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

export default function Layout() {
  return (
    <>
      <Header />
      <main
        style={{
          padding: 16,
          marginTop: 100,
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
