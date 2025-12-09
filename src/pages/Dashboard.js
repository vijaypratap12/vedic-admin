import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Plus, ArrowRight, BookMarked, FileEdit, FlaskConical, GraduationCap } from 'lucide-react';
import apiService from '../services/api';
import '../styles/admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalChapters: 0,
    totalTextbooks: 0,
    totalTextbookChapters: 0,
    totalResearchPapers: 0,
    totalThesis: 0,
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [recentTextbooks, setRecentTextbooks] = useState([]);
  const [recentResearchPapers, setRecentResearchPapers] = useState([]);
  const [recentThesis, setRecentThesis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all books
      const books = await apiService.getAllBooks();
      
      // Calculate total chapters
      let totalChapters = 0;
      books.forEach(book => {
        totalChapters += book.totalChapters || 0;
      });

      // Fetch all textbooks
      const textbooks = await apiService.getAllTextbooks();
      
      // Calculate total textbook chapters
      let totalTextbookChapters = 0;
      textbooks.forEach(textbook => {
        totalTextbookChapters += textbook.totalChapters || 0;
      });

      setStats({
        totalBooks: books.length,
        totalChapters: totalChapters,
        totalTextbooks: textbooks.length,
        totalTextbookChapters: totalTextbookChapters,
      });

      // Get recent books (last 5)
      const recent = books.slice(0, 5);
      setRecentBooks(recent);

      // Get recent textbooks (last 5)
      const recentTb = textbooks.slice(0, 5);
      setRecentTextbooks(recentTb);

      // Fetch research papers
      const researchPapers = await apiService.getAllResearchPapers();
      
      // Fetch thesis
      const thesis = await apiService.getAllThesis();

      setStats({
        totalBooks: books.length,
        totalChapters: totalChapters,
        totalTextbooks: textbooks.length,
        totalTextbookChapters: totalTextbookChapters,
        totalResearchPapers: researchPapers.length,
        totalThesis: thesis.length,
      });

      // Get recent research papers (last 5)
      const recentRP = researchPapers.slice(0, 5);
      setRecentResearchPapers(recentRP);

      // Get recent thesis (last 5)
      const recentTh = thesis.slice(0, 5);
      setRecentThesis(recentTh);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="alert alert-error">
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome to Vedic AI Admin Panel</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={32} />
          </div>
          <div className="stat-label">Total Books</div>
          <div className="stat-value">{stats.totalBooks}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={32} />
          </div>
          <div className="stat-label">Total Chapters</div>
          <div className="stat-value">{stats.totalChapters}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BookMarked size={32} />
          </div>
          <div className="stat-label">Total Textbooks</div>
          <div className="stat-value">{stats.totalTextbooks}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileEdit size={32} />
          </div>
          <div className="stat-label">Textbook Chapters</div>
          <div className="stat-value">{stats.totalTextbookChapters}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FlaskConical size={32} />
          </div>
          <div className="stat-label">Research Papers</div>
          <div className="stat-value">{stats.totalResearchPapers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <GraduationCap size={32} />
          </div>
          <div className="stat-label">Thesis</div>
          <div className="stat-value">{stats.totalThesis}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link to="/books?action=new" className="btn btn-primary btn-lg">
            <Plus size={20} />
            Add New Book
          </Link>
          <Link to="/books" className="btn btn-outline btn-lg">
            <BookOpen size={20} />
            View All Books
          </Link>
          <Link to="/chapters" className="btn btn-outline btn-lg">
            <FileText size={20} />
            Manage Chapters
          </Link>
          <Link to="/textbooks?action=new" className="btn btn-primary btn-lg">
            <Plus size={20} />
            Add New Textbook
          </Link>
          <Link to="/textbooks" className="btn btn-outline btn-lg">
            <BookMarked size={20} />
            View All Textbooks
          </Link>
          <Link to="/textbook-chapters" className="btn btn-outline btn-lg">
            <FileEdit size={20} />
            Manage Textbook Chapters
          </Link>
          <Link to="/research-papers?action=new" className="btn btn-primary btn-lg">
            <Plus size={20} />
            Add Research Paper
          </Link>
          <Link to="/research-papers" className="btn btn-outline btn-lg">
            <FlaskConical size={20} />
            View Research Papers
          </Link>
          <Link to="/thesis?action=new" className="btn btn-primary btn-lg">
            <Plus size={20} />
            Add Thesis
          </Link>
          <Link to="/thesis" className="btn btn-outline btn-lg">
            <GraduationCap size={20} />
            View Thesis
          </Link>
        </div>
      </div>

      {/* Recent Books */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Recent Books</h2>
          <Link to="/books" className="btn btn-sm btn-outline">
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
        
        {recentBooks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BookOpen size={48} />
            </div>
            <div className="empty-state-title">No books yet</div>
            <p className="empty-state-text">
              Start by adding your first book to the system.
            </p>
            <Link to="/books?action=new" className="btn btn-primary">
              <Plus size={18} />
              Add First Book
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Chapters</th>
                  <th>Language</th>
                </tr>
              </thead>
              <tbody>
                {recentBooks.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <Link
                        to={`/books/${book.id}/chapters`}
                        style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                      >
                        {book.title}
                      </Link>
                    </td>
                    <td>{book.author}</td>
                    <td>{book.category || '-'}</td>
                    <td>{book.totalChapters || 0}</td>
                    <td>{book.language || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Textbooks */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Textbooks</h2>
          <Link to="/textbooks" className="btn btn-sm btn-outline">
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
        
        {recentTextbooks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BookMarked size={48} />
            </div>
            <div className="empty-state-title">No textbooks yet</div>
            <p className="empty-state-text">
              Start by adding your first textbook to the system.
            </p>
            <Link to="/textbooks?action=new" className="btn btn-primary">
              <Plus size={18} />
              Add First Textbook
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Level</th>
                  <th>Category</th>
                  <th>Chapters</th>
                </tr>
              </thead>
              <tbody>
                {recentTextbooks.map((textbook) => (
                  <tr key={textbook.id}>
                    <td>
                      <Link
                        to={`/textbooks/${textbook.id}/chapters`}
                        style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                      >
                        {textbook.title}
                      </Link>
                    </td>
                    <td>{textbook.author}</td>
                    <td>
                      <span className={`badge ${textbook.level === 'UG' ? 'badge-primary' : 'badge-success'}`}>
                        {textbook.level || '-'}
                      </span>
                    </td>
                    <td>{textbook.category || '-'}</td>
                    <td>{textbook.totalChapters || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Research Papers */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Recent Research Papers</h2>
          <Link to="/research-papers" className="btn btn-sm btn-outline">
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
        
        {recentResearchPapers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FlaskConical size={48} />
            </div>
            <div className="empty-state-title">No research papers yet</div>
            <p className="empty-state-text">
              Start by adding your first research paper to the system.
            </p>
            <Link to="/research-papers?action=new" className="btn btn-primary">
              <Plus size={18} />
              Add First Research Paper
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Authors</th>
                  <th>Institution</th>
                  <th>Year</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {recentResearchPapers.map((paper) => (
                  <tr key={paper.id}>
                    <td>{paper.title}</td>
                    <td>
                      {Array.isArray(paper.authors) 
                        ? paper.authors.slice(0, 2).join(', ')
                        : paper.authors}
                      {Array.isArray(paper.authors) && paper.authors.length > 2 && ' +' + (paper.authors.length - 2)}
                    </td>
                    <td>{paper.institution}</td>
                    <td>{paper.year}</td>
                    <td>
                      <span className="badge badge-primary">
                        {paper.category.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Thesis */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Thesis</h2>
          <Link to="/thesis" className="btn btn-sm btn-outline">
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
        
        {recentThesis.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <GraduationCap size={48} />
            </div>
            <div className="empty-state-title">No thesis yet</div>
            <p className="empty-state-text">
              Start by adding your first thesis to the system.
            </p>
            <Link to="/thesis?action=new" className="btn btn-primary">
              <Plus size={18} />
              Add First Thesis
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Institution</th>
                  <th>Year</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {recentThesis.map((thesis) => (
                  <tr key={thesis.id}>
                    <td>{thesis.title}</td>
                    <td>{thesis.author}</td>
                    <td>{thesis.institution}</td>
                    <td>{thesis.year}</td>
                    <td>
                      <span className="badge badge-success">
                        {thesis.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

