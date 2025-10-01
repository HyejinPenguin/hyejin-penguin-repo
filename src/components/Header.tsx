export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Hyejin Penguin!</h1>
        </div>
        <nav className="navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/" className="nav-link">홈</a>
            </li>
            <li className="nav-item">
              <a href="/about" className="nav-link">소개</a>
            </li>
            <li className="nav-item">
              <a href="/projects" className="nav-link">프로젝트</a>
            </li>
            <li className="nav-item">
              <a href="/contact" className="nav-link">연락처</a>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" aria-label="테마 변경">
            🌙
          </button>
        </div>
      </div>
    </header>
  );
}

