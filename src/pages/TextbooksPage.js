import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, BookOpen, Search, X, Star, TrendingUp } from 'lucide-react';
import apiService from '../services/api';
import TextbookForm from '../components/TextbookForm';
import '../styles/admin.css';

const TextbooksPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [textbooks, setTextbooks] = useState([]);
  const [filteredTextbooks, setFilteredTextbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTextbook, setEditingTextbook] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTextbooks();
    
    // Check if we should open the form
    const action = searchParams.get('action');
    if (action === 'new') {
      handleAddNew();
    }
  }, [searchParams]);

  useEffect(() => {
    // Filter textbooks based on search term
    if (searchTerm.trim() === '') {
      setFilteredTextbooks(textbooks);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = textbooks.filter(
        (textbook) =>
          textbook.title.toLowerCase().includes(term) ||
          textbook.author.toLowerCase().includes(term) ||
          (textbook.category && textbook.category.toLowerCase().includes(term)) ||
          (textbook.level && textbook.level.toLowerCase().includes(term)) ||
          (textbook.tags && textbook.tags.toLowerCase().includes(term))
      );
      setFilteredTextbooks(filtered);
    }
  }, [searchTerm, textbooks]);

  const fetchTextbooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllTextbooks();
      setTextbooks(data);
      setFilteredTextbooks(data);
    } catch (err) {
      setError(err.message || 'Failed to load textbooks');
      console.error('Error fetching textbooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingTextbook(null);
    setShowModal(true);
  };

  const handleEdit = (textbook) => {
    setEditingTextbook(textbook);
    setShowModal(true);
  };

  const handleDelete = async (textbook) => {
    if (!window.confirm(`Are you sure you want to delete "${textbook.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.deleteTextbook(textbook.id);
      setSuccessMessage(`Textbook "${textbook.title}" deleted successfully`);
      fetchTextbooks();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete textbook');
      console.error('Error deleting textbook:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTextbook) {
        await apiService.updateTextbook(editingTextbook.id, formData);
        setSuccessMessage(`Textbook "${formData.title}" updated successfully`);
      } else {
        await apiService.createTextbook(formData);
        setSuccessMessage(`Textbook "${formData.title}" created successfully`);
      }
      
      setShowModal(false);
      setEditingTextbook(null);
      fetchTextbooks();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      throw new Error(err.message || 'Failed to save textbook');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingTextbook(null);
  };

  const handleViewChapters = (textbookId) => {
    navigate(`/textbooks/${textbookId}/chapters`);
  };

  const clearSearch = () => {
    setSearchTerm('');
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

  return (
    <div className="admin-container">
      <div className="page-header">
        <h1 className="page-title">Textbooks Management</h1>
        <p className="page-subtitle">Manage all textbooks in the system</p>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Textbooks ({filteredTextbooks.length})</h2>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <Plus size={18} />
            Add New Textbook
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, author, category, level, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingRight: searchTerm ? '2.5rem' : '0.875rem' }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '0.25rem',
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button className="btn btn-outline">
            <Search size={18} />
            Search
          </button>
        </div>

        {filteredTextbooks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BookOpen size={48} />
            </div>
            <div className="empty-state-title">
              {searchTerm ? 'No textbooks found' : 'No textbooks yet'}
            </div>
            <p className="empty-state-text">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start by adding your first textbook to the system.'}
            </p>
            {!searchTerm && (
              <button className="btn btn-primary" onClick={handleAddNew}>
                <Plus size={18} />
                Add First Textbook
              </button>
            )}
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
                  <th>Rating</th>
                  <th>Stats</th>
                  <th>Chapters</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTextbooks.map((textbook) => (
                  <tr key={textbook.id}>
                    <td>
                      <strong>{textbook.title}</strong>
                      {textbook.year && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          {textbook.year}
                        </div>
                      )}
                    </td>
                    <td>{textbook.author}</td>
                    <td>
                      <span className={`badge ${textbook.level === 'UG' ? 'badge-primary' : 'badge-success'}`}>
                        {textbook.level || '-'}
                      </span>
                    </td>
                    <td>{textbook.category || '-'}</td>
                    <td>
                      {textbook.rating ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Star size={14} fill="currentColor" style={{ color: '#fbbf24' }} />
                          <span>{textbook.rating.toFixed(1)}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <TrendingUp size={12} />
                          {textbook.downloadCount || 0} downloads
                        </div>
                        <div>{textbook.viewCount || 0} views</div>
                      </div>
                    </td>
                    <td>{textbook.totalChapters || 0}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleViewChapters(textbook.id)}
                          title="View Chapters"
                        >
                          <BookOpen size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEdit(textbook)}
                          title="Edit Textbook"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(textbook)}
                          title="Delete Textbook"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Textbook */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingTextbook ? 'Edit Textbook' : 'Add New Textbook'}
              </h2>
              <button className="modal-close" onClick={handleCancel}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <TextbookForm
                textbook={editingTextbook}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextbooksPage;

