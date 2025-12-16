import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, X, Star, Award } from 'lucide-react';
import apiService from '../services/api';
import ResearchPaperForm from '../components/ResearchPaperForm';
import '../styles/admin.css';

const ResearchPapersPage = () => {
  
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [previewPaper, setPreviewPaper] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPapers();
  }, []);

  useEffect(() => {
    // Filter papers based on search term
    if (searchTerm.trim() === '') {
      setFilteredPapers(papers);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = papers.filter(
        (paper) =>
          paper.title.toLowerCase().includes(term) ||
          (paper.authors && paper.authors.some(author => author.toLowerCase().includes(term))) ||
          paper.institution.toLowerCase().includes(term) ||
          (paper.category && paper.category.toLowerCase().includes(term))
      );
      setFilteredPapers(filtered);
    }
  }, [searchTerm, papers]);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllResearchPapers();
      setPapers(data);
      setFilteredPapers(data);
    } catch (err) {
      setError(err.message || 'Failed to load research papers');
      console.error('Error fetching research papers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingPaper(null);
    setShowModal(true);
  };

  const handleEdit = async (paper) => {
    try {
      // Fetch full paper details including contentHtml
      const fullPaper = await apiService.getResearchPaperById(paper.id);
      setEditingPaper(fullPaper);
      setShowModal(true);
    } catch (err) {
      setError(err.message || 'Failed to load research paper details');
      console.error('Error fetching research paper:', err);
    }
  };

  const handlePreview = async (paper) => {
    try {
      // Fetch full paper details for preview
      const fullPaper = await apiService.getResearchPaperById(paper.id);
      setPreviewPaper(fullPaper);
    } catch (err) {
      setError(err.message || 'Failed to load research paper for preview');
      console.error('Error fetching research paper:', err);
    }
  };

  const handleDelete = async (paper) => {
    if (!window.confirm(`Are you sure you want to delete "${paper.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.deleteResearchPaper(paper.id);
      setSuccessMessage(`Research paper "${paper.title}" deleted successfully`);
      fetchPapers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete research paper');
      console.error('Error deleting research paper:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPaper) {
        await apiService.updateResearchPaper(editingPaper.id, formData);
        setSuccessMessage(`Research paper "${formData.title}" updated successfully`);
      } else {
        await apiService.createResearchPaper(formData);
        setSuccessMessage(`Research paper "${formData.title}" created successfully`);
      }
      
      setShowModal(false);
      setEditingPaper(null);
      fetchPapers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      throw new Error(err.message || 'Failed to save research paper');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'clinical-trial':
        return 'badge-success';
      case 'research-paper':
        return 'badge-primary';
      case 'review-article':
        return 'badge-info';
      case 'case-study':
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
        <h1 className="page-title">Research Papers</h1>
        <p className="page-subtitle">
          Manage research papers, clinical trials, and academic publications
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
          Add Research Paper
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Papers</div>
          <div className="stat-value">{papers.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Featured</div>
          <div className="stat-value">
            {papers.filter(p => p.isFeatured).length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Published</div>
          <div className="stat-value">
            {papers.filter(p => p.status === 'published').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Views</div>
          <div className="stat-value">
            {papers.reduce((sum, p) => sum + (p.viewCount || 0), 0)}
          </div>
        </div>
      </div>

      {/* Papers List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Research Papers ({filteredPapers.length})</h2>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, authors, institution, or category..."
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

      {filteredPapers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Eye size={48} />
          </div>
          <div className="empty-state-title">No research papers found</div>
          <p className="empty-state-text">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first research paper'}
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={handleAddNew}>
              <Plus size={18} />
              Add Research Paper
            </button>
          )}
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
                <th>Views</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPapers.map((paper) => (
                <tr key={paper.id}>
                  <td>
                    {paper.isFeatured && (
                      <Award size={14} style={{ marginRight: '0.5rem', color: 'var(--warning-color)', verticalAlign: 'middle' }} />
                    )}
                    {paper.title}
                  </td>
                  <td>
                    {Array.isArray(paper.authors) 
                      ? paper.authors.slice(0, 2).join(', ')
                      : paper.authors}
                    {Array.isArray(paper.authors) && paper.authors.length > 2 && (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}> +{paper.authors.length - 2}</span>
                    )}
                  </td>
                  <td>{paper.institution}</td>
                  <td>{paper.year}</td>
                  <td>
                    <span className={`badge ${getCategoryBadgeClass(paper.category)}`}>
                      {paper.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td>{paper.viewCount || 0}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={14} fill="var(--warning-color)" color="var(--warning-color)" />
                      {paper.rating.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      paper.status === 'published' ? 'badge-success' :
                      paper.status === 'under-review' ? 'badge-warning' :
                      'badge-secondary'
                    }`}>
                      {paper.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handlePreview(paper)}
                        title="Preview Research Paper"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleEdit(paper)}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(paper)}
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
        <ResearchPaperForm
          paper={editingPaper}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditingPaper(null);
          }}
        />
      )}

      {/* Preview Modal */}
      {previewPaper && (
        <div className="modal-overlay" onClick={() => setPreviewPaper(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1200px' }}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{previewPaper.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  <strong>Authors:</strong> {Array.isArray(previewPaper.authors) ? previewPaper.authors.join(', ') : previewPaper.authors}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  <strong>Institution:</strong> {previewPaper.institution} • <strong>Year:</strong> {previewPaper.year}
                </p>
                {previewPaper.journalName && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    <strong>Journal:</strong> {previewPaper.journalName}
                    {previewPaper.volume && ` • Volume ${previewPaper.volume}`}
                    {previewPaper.issueNumber && ` • Issue ${previewPaper.issueNumber}`}
                  </p>
                )}
              </div>
              <button className="modal-close" onClick={() => setPreviewPaper(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {previewPaper.abstract && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Abstract</h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    {previewPaper.abstract}
                  </p>
                </div>
              )}
              {previewPaper.keywords && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Keywords</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(Array.isArray(previewPaper.keywords) ? previewPaper.keywords : previewPaper.keywords.split(',')).map((keyword, index) => (
                      <span key={index} className="badge badge-secondary">
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="preview-container">
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Full Content</h3>
                <div dangerouslySetInnerHTML={{ __html: previewPaper.contentHtml }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setPreviewPaper(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchPapersPage;

