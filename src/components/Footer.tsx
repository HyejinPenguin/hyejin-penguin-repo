export default function Footer() {
    return (
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <h2>Hyejin Penguin!</h2>
          </div>
          <nav className="footer-navigation">
            <ul className="footer-nav-list">
              <li className="footer-nav-item">
                <a href="/" className="footer-nav-link">홈</a>
              </li>
              <li className="footer-nav-item">
                <a href="/about" className="footer-nav-link">소개</a>
              </li>
              <li className="footer-nav-item">
                <a href="/projects" className="footer-nav-link">프로젝트</a>
              </li>
              <li className="footer-nav-item">
                <a href="/contact" className="footer-nav-link">연락처</a>
              </li>
            </ul>
          </nav>
          <div className="footer-info">
            <p>© 2025 Hyejin Penguin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
  