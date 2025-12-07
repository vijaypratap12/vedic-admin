import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Plus, ArrowRight, BookMarked, FileEdit } from 'lucide-react';
import apiService from '../services/api';
import '../styles/admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalChapters: 0,
    totalTextbooks: 0,
    totalTextbookChapters: 0,
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [recentTextbooks, setRecentTextbooks] = useState([]);
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
    </div>
  );
};

export default Dashboard;

