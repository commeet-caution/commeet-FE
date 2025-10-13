export default function Home() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Commeet Portal</h1>
        <nav>
          <button className="login-button">로그인</button>
        </nav>
      </header>
      <main className="landing-main">
        <h2>교수님과의 면담, <br /> 더 쉽고 간편하게.</h2>
        <p>지금 바로 시작해보세요.</p>
        <button className="start-button">시작하기</button>
      </main>
    </div>
  );
}
