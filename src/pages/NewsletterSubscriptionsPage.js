import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Search, X, Calendar, CheckCircle, XCircle, UserX, Download } from 'lucide-react';
import apiService from '../services/api';
import '../styles/admin.css';

const NewsletterSubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    // Filter subscriptions based on search term and status
    let filtered = subscriptions;

    // Filter by status
    if (statusFilter === 'active') {
      filtered = filtered.filter(sub => sub.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(sub => !sub.isActive);
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (sub) => sub.email.toLowerCase().includes(term)
      );
    }

    setFilteredSubscriptions(filtered);
  }, [searchTerm, statusFilter, subscriptions]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllNewsletterSubscriptions();
      setSubscriptions(data);
      setFilteredSubscriptions(data);
    } catch (err) {
      setError(err.message || 'Failed to load newsletter subscriptions');
      console.error('Error fetching newsletter subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (subscription) => {
    if (!window.confirm(`Are you sure you want to unsubscribe "${subscription.email}"?`)) {
      return;
    }

    try {
      await apiService.unsubscribeNewsletter(subscription.id);
      setSuccessMessage(`"${subscription.email}" unsubscribed successfully`);
      fetchSubscriptions();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to unsubscribe');
      console.error('Error unsubscribing:', err);
    }
  };

  const handleDelete = async (subscription) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${subscription.email}" from the database? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.deleteNewsletterSubscription(subscription.id);
      setSuccessMessage(`"${subscription.email}" deleted successfully`);
      fetchSubscriptions();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete subscription');
      console.error('Error deleting subscription:', err);
    }
  };

  const handleExportToCSV = () => {
    const csvContent = [
      ['Email', 'Status', 'Subscribed At', 'Source', 'Unsubscribed At'],
      ...filteredSubscriptions.map(sub => [
        sub.email,
        sub.isActive ? 'Active' : 'Inactive',
        new Date(sub.subscribedAt).toLocaleString(),
        sub.source || 'N/A',
        sub.unsubscribedAt ? new Date(sub.unsubscribedAt).toLocaleString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
          <h1>Newsletter Subscriptions</h1>
          <p>Manage newsletter subscribers and export email lists</p>
        </div>
        <button onClick={handleExportToCSV} className="btn btn-primary">
          <Download size={20} />
          Export to CSV
        </button>
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
            placeholder="Search by email..."
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
            <option value="all">All Subscriptions</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      {!loading && subscriptions.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Subscriptions</div>
            <div className="stat-value">{subscriptions.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Subscribers</div>
            <div className="stat-value" style={{ color: '#10b981' }}>
              {subscriptions.filter(s => s.isActive).length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Unsubscribed</div>
            <div className="stat-value" style={{ color: '#ef4444' }}>
              {subscriptions.filter(s => !s.isActive).length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">This Month</div>
            <div className="stat-value" style={{ color: '#3b82f6' }}>
              {subscriptions.filter(s => {
                const subDate = new Date(s.subscribedAt);
                const now = new Date();
                return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading newsletter subscriptions...</p>
        </div>
      )}

      {/* Table */}
      {!loading && filteredSubscriptions.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Source</th>
                <th>Subscribed At</th>
                <th>Unsubscribed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} style={{ color: 'var(--primary-color)' }} />
                      <span>{subscription.email}</span>
                    </div>
                  </td>
                  <td>
                    {subscription.isActive ? (
                      <span className="badge badge-success">
                        <CheckCircle size={14} />
                        Active
                      </span>
                    ) : (
                      <span className="badge badge-secondary">
                        <XCircle size={14} />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-default">{subscription.source || 'N/A'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                      <span>{formatDate(subscription.subscribedAt)}</span>
                    </div>
                  </td>
                  <td>
                    {subscription.unsubscribedAt ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                        <span>{formatDate(subscription.unsubscribedAt)}</span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>—</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {subscription.isActive && (
                        <button
                          onClick={() => handleUnsubscribe(subscription)}
                          className="btn-icon btn-icon-warning"
                          title="Unsubscribe"
                        >
                          <UserX size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(subscription)}
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
      {!loading && filteredSubscriptions.length === 0 && (
        <div className="empty-state">
          <Mail size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
          <h3>No newsletter subscriptions found</h3>
          <p>
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters or search term'
              : 'Newsletter subscriptions will appear here when users subscribe'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsletterSubscriptionsPage;

