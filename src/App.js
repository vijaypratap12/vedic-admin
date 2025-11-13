import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { BookOpen, FileText, LayoutDashboard } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import BooksPage from './pages/BooksPage';
import ChaptersPage from './pages/ChaptersPage';
import './styles/admin.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation */}
        <nav className="admin-nav">
          <div className="nav-content">
            <Link to="/" className="nav-brand">
              Vedic AI Admin
            </Link>
            <ul className="nav-links">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  end
                >
                  <LayoutDashboard size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/books"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <BookOpen size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Books
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/chapters"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <FileText size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Chapters
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:bookId/chapters" element={<ChaptersPage />} />
          <Route path="/chapters" element={<ChaptersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
