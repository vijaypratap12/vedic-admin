import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { BookOpen, FileText, LayoutDashboard, BookMarked, FileEdit, FlaskConical, GraduationCap } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import BooksPage from './pages/BooksPage';
import ChaptersPage from './pages/ChaptersPage';
import TextbooksPage from './pages/TextbooksPage';
import TextbookChaptersPage from './pages/TextbookChaptersPage';
import ResearchPapersPage from './pages/ResearchPapersPage';
import ThesisPage from './pages/ThesisPage';
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
              <li>
                <NavLink
                  to="/textbooks"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <BookMarked size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Textbooks
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/textbook-chapters"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <FileEdit size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Textbook Chapters
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/research-papers"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <FlaskConical size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Research Papers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/thesis"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <GraduationCap size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Thesis
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
          <Route path="/textbooks" element={<TextbooksPage />} />
          <Route path="/textbooks/:textbookId/chapters" element={<TextbookChaptersPage />} />
          <Route path="/textbook-chapters" element={<TextbookChaptersPage />} />
          <Route path="/research-papers" element={<ResearchPapersPage />} />
          <Route path="/thesis" element={<ThesisPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
