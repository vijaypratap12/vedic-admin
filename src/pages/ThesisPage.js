import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BookOpen, Search, X, Star, Award, Eye } from 'lucide-react';
import apiService from '../services/api';
import ThesisForm from '../components/ThesisForm';
import '../styles/admin.css';

const ThesisPage = () => {
  
  const [thesisList, setThesisList] = useState([]);
  const [filteredThesis, setFilteredThesis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingThesis, setEditingThesis] = useState(null);
  const [previewThesis, setPreviewThesis] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchThesis();
  }, []);

  useEffect(() => {
    // Filter thesis based on search term
    if (searchTerm.trim() === '') {
      setFilteredThesis(thesisList);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = thesisList.filter(
        (thesis) =>
          thesis.title.toLowerCase().includes(term) ||
          thesis.author.toLowerCase().includes(term) ||
          thesis.institution.toLowerCase().includes(term) ||
          (thesis.category && thesis.category.toLowerCase().includes(term))
      );
      setFilteredThesis(filtered);
    }
  }, [searchTerm, thesisList]);

  const fetchThesis = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllThesis();
      setThesisList(data);
      setFilteredThesis(data);
    } catch (err) {
      setError(err.message || 'Failed to load thesis');
      console.error('Error fetching thesis:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingThesis(null);
    setShowModal(true);
  };

  const handleEdit = async (thesis) => {
    try {
      // Fetch full thesis details including contentHtml
      const fullThesis = await apiService.getThesisById(thesis.id);
      setEditingThesis(fullThesis);
      setShowModal(true);
    } catch (err) {
      setError(err.message || 'Failed to load thesis details');
      console.error('Error fetching thesis:', err);
    }
  };

  const handlePreview = async (thesis) => {
    try {
      // Fetch full thesis details for preview
      const fullThesis = await apiService.getThesisById(thesis.id);
      setPreviewThesis(fullThesis);
    } catch (err) {
      setError(err.message || 'Failed to load thesis for preview');
      console.error('Error fetching thesis:', err);
    }
  };

  const handleDelete = async (thesis) => {
    if (!window.confirm(`Are you sure you want to delete "${thesis.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.deleteThesis(thesis.id);
      setSuccessMessage(`Thesis "${thesis.title}" deleted successfully`);
      fetchThesis();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete thesis');
      console.error('Error deleting thesis:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingThesis) {
        await apiService.updateThesis(editingThesis.id, formData);
        setSuccessMessage(`Thesis "${formData.title}" updated successfully`);
      } else {
        await apiService.createThesis(formData);
        setSuccessMessage(`Thesis "${formData.title}" created successfully`);
      }
      
      setShowModal(false);
      setEditingThesis(null);
      fetchThesis();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      throw new Error(err.message || 'Failed to save thesis');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'PhD Thesis':
        return 'badge-success';
      case 'MS Thesis':
        return 'badge-primary';
      case 'MD Thesis':
        return 'badge-info';
      case 'Post-Doctoral':
        return 'badge-warning';
      default:
        return 'badge-secondary';
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

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Thesis Repository</h1>
        <p className="page-subtitle">
          Manage PhD, MS, MD thesis and post-doctoral research
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
          <button className="btn-icon" onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={handleAddNew}>
          <Plus size={18} />
          Add Thesis
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Thesis</div>
          <div className="stat-value">{thesisList.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Featured</div>
          <div className="stat-value">
            {thesisList.filter(t => t.isFeatured).length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Published</div>
          <div className="stat-value">
            {thesisList.filter(t => t.status === 'published').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Views</div>
          <div className="stat-value">
            {thesisList.reduce((sum, t) => sum + (t.viewCount || 0), 0)}
          </div>
        </div>
      </div>

      {/* Thesis List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Thesis ({filteredThesis.length})</h2>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, author, institution, or category..."
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

      {filteredThesis.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <BookOpen size={48} />
          </div>
          <div className="empty-state-title">No thesis found</div>
          <p className="empty-state-text">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first thesis'}
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={handleAddNew}>
              <Plus size={18} />
              Add Thesis
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
                <th>Institution</th>
                <th>Year</th>
                <th>Category</th>
                <th>Grade</th>
                <th>Views</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredThesis.map((thesis) => (
                <tr key={thesis.id}>
                  <td>
                    {thesis.isFeatured && (
                      <Award size={14} style={{ marginRight: '0.5rem', color: 'var(--warning-color)', verticalAlign: 'middle' }} />
                    )}
                    {thesis.title}
                  </td>
                  <td>{thesis.author}</td>
                  <td>{thesis.institution}</td>
                  <td>{thesis.year}</td>
                  <td>
                    <span className={`badge ${getCategoryBadgeClass(thesis.category)}`}>
                      {thesis.category}
                    </span>
                  </td>
                  <td>
                    {thesis.grade && (
                      <span className="badge badge-success">
                        {thesis.grade}
                      </span>
                    )}
                  </td>
                  <td>{thesis.viewCount || 0}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={14} fill="var(--warning-color)" color="var(--warning-color)" />
                      {thesis.rating.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      thesis.status === 'published' ? 'badge-success' :
                      thesis.status === 'under-review' ? 'badge-warning' :
                      'badge-secondary'
                    }`}>
                      {thesis.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handlePreview(thesis)}
                        title="Preview Thesis"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleEdit(thesis)}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(thesis)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
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

      {/* Modal */}
      {showModal && (
        <ThesisForm
          thesis={editingThesis}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditingThesis(null);
          }}
        />
      )}

      {/* Preview Modal */}
      {previewThesis && (
        <div className="modal-overlay" onClick={() => setPreviewThesis(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1200px' }}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{previewThesis.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  <strong>Author:</strong> {previewThesis.author}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  <strong>Institution:</strong> {previewThesis.institution} • <strong>Department:</strong> {previewThesis.department}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  <strong>Category:</strong> {previewThesis.category} • <strong>Year:</strong> {previewThesis.year}
                  {previewThesis.grade && ` • Grade: ${previewThesis.grade}`}
                </p>
                {previewThesis.guideNames && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    <strong>Guide(s):</strong> {Array.isArray(previewThesis.guideNames) ? previewThesis.guideNames.join(', ') : previewThesis.guideNames}
                  </p>
                )}
              </div>
              <button className="modal-close" onClick={() => setPreviewThesis(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {previewThesis.abstract && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Abstract</h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    {previewThesis.abstract}
                  </p>
                </div>
              )}
              {previewThesis.keywords && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Keywords</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(Array.isArray(previewThesis.keywords) ? previewThesis.keywords : previewThesis.keywords.split(',')).map((keyword, index) => (
                      <span key={index} className="badge badge-secondary">
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="preview-container">
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Full Content</h3>
                <div dangerouslySetInnerHTML={{ __html: previewThesis.contentHtml }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setPreviewThesis(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThesisPage;

