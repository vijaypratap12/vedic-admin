import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Search, X, Mail, User, Building, MessageSquare, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import apiService from '../services/api';
import '../styles/admin.css';

const ContactSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Modal state
  const [previewSubmission, setPreviewSubmission] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    // Filter submissions based on search term, status, and type
    let filtered = submissions;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(sub => sub.contactType === typeFilter);
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (sub) =>
          sub.name.toLowerCase().includes(term) ||
          sub.email.toLowerCase().includes(term) ||
          sub.subject.toLowerCase().includes(term) ||
          (sub.organization && sub.organization.toLowerCase().includes(term)) ||
          sub.message.toLowerCase().includes(term)
      );
    }

    setFilteredSubmissions(filtered);
  }, [searchTerm, statusFilter, typeFilter, submissions]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllContactSubmissions();
      setSubmissions(data);
      setFilteredSubmissions(data);
    } catch (err) {
      setError(err.message || 'Failed to load contact submissions');
      console.error('Error fetching contact submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (submission) => {
    try {
      const fullSubmission = await apiService.getContactSubmissionById(submission.id);
      setPreviewSubmission(fullSubmission);
    } catch (err) {
      setError(err.message || 'Failed to load submission details');
      console.error('Error fetching submission:', err);
    }
  };

  const handleDelete = async (submission) => {
    if (!window.confirm(`Are you sure you want to delete the submission from "${submission.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.deleteContactSubmission(submission.id);
      setSuccessMessage(`Submission from "${submission.name}" deleted successfully`);
      fetchSubmissions();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete submission');
      console.error('Error deleting submission:', err);
    }
  };

  const handleUpdateStatus = async (submissionId, newStatus) => {
    try {
      await apiService.updateContactSubmission(submissionId, { status: newStatus });
      setSuccessMessage('Status updated successfully');
      fetchSubmissions();
      if (previewSubmission && previewSubmission.id === submissionId) {
        setPreviewSubmission({ ...previewSubmission, status: newStatus });
      }
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update status');
      console.error('Error updating status:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock size={16} style={{ color: '#f59e0b' }} />;
      case 'InProgress':
        return <MessageSquare size={16} style={{ color: '#3b82f6' }} />;
      case 'Resolved':
        return <CheckCircle size={16} style={{ color: '#10b981' }} />;
      case 'Closed':
        return <XCircle size={16} style={{ color: '#6b7280' }} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge-warning';
      case 'InProgress':
        return 'badge-info';
      case 'Resolved':
        return 'badge-success';
      case 'Closed':
        return 'badge-secondary';
      default:
        return 'badge-default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Contact Submissions</h1>
          <p>Manage and respond to contact form submissions</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success">
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <XCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Filters and Search */}
      <div className="page-controls">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, subject, or message..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="clear-search-btn"
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="general">General Inquiry</option>
            <option value="collaboration">Collaboration</option>
            <option value="contribution">Content Contribution</option>
            <option value="technical">Technical Support</option>
            <option value="research">Research Submission</option>
            <option value="feedback">Feedback & Suggestions</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      {!loading && submissions.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Submissions</div>
            <div className="stat-value">{submissions.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value" style={{ color: '#f59e0b' }}>
              {submissions.filter(s => s.status === 'Pending').length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">In Progress</div>
            <div className="stat-value" style={{ color: '#3b82f6' }}>
              {submissions.filter(s => s.status === 'InProgress').length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Resolved</div>
            <div className="stat-value" style={{ color: '#10b981' }}>
              {submissions.filter(s => s.status === 'Resolved').length}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading contact submissions...</p>
        </div>
      )}

      {/* Table */}
      {!loading && filteredSubmissions.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} style={{ color: 'var(--primary-color)' }} />
                      <span>{submission.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
                      <span>{submission.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-default">{submission.contactType}</span>
                  </td>
                  <td>
                    <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {submission.subject}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      {submission.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                      <span>{formatDate(submission.submittedAt)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handlePreview(submission)}
                        className="btn-icon btn-icon-primary"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(submission)}
                        className="btn-icon btn-icon-danger"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Results */}
      {!loading && filteredSubmissions.length === 0 && (
        <div className="empty-state">
          <MessageSquare size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
          <h3>No contact submissions found</h3>
          <p>
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters or search term'
              : 'Contact submissions will appear here when users submit the contact form'}
          </p>
        </div>
      )}

      {/* Preview Modal */}
      {previewSubmission && (
        <div className="modal-overlay" onClick={() => setPreviewSubmission(null)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Submission Details</h2>
              <button onClick={() => setPreviewSubmission(null)} className="modal-close">
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label><User size={16} /> Name</label>
                  <p>{previewSubmission.name}</p>
                </div>
                <div className="detail-item">
                  <label><Mail size={16} /> Email</label>
                  <p>{previewSubmission.email}</p>
                </div>
                {previewSubmission.organization && (
                  <div className="detail-item">
                    <label><Building size={16} /> Organization</label>
                    <p>{previewSubmission.organization}</p>
                  </div>
                )}
                <div className="detail-item">
                  <label>Contact Type</label>
                  <p><span className="badge badge-default">{previewSubmission.contactType}</span></p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span className={`badge ${getStatusBadgeClass(previewSubmission.status)}`}>
                      {getStatusIcon(previewSubmission.status)}
                      {previewSubmission.status}
                    </span>
                    <select
                      value={previewSubmission.status}
                      onChange={(e) => handleUpdateStatus(previewSubmission.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div className="detail-item">
                  <label><Calendar size={16} /> Submitted At</label>
                  <p>{formatDate(previewSubmission.submittedAt)}</p>
                </div>
                <div className="detail-item full-width">
                  <label>Subject</label>
                  <p style={{ fontWeight: '600' }}>{previewSubmission.subject}</p>
                </div>
                <div className="detail-item full-width">
                  <label><MessageSquare size={16} /> Message</label>
                  <div className="message-content">
                    {previewSubmission.message}
                  </div>
                </div>
                {previewSubmission.notes && (
                  <div className="detail-item full-width">
                    <label>Internal Notes</label>
                    <div className="message-content">
                      {previewSubmission.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setPreviewSubmission(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissionsPage;

