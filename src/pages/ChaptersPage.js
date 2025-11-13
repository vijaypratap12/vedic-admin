import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, ArrowLeft, BookOpen, X } from 'lucide-react';
import apiService from '../services/api';
import ChapterForm from '../components/ChapterForm';
import '../styles/admin.css';

const ChaptersPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(bookId || '');
  const [bookWithChapters, setBookWithChapters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [previewChapter, setPreviewChapter] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllBooks();
      setBooks(data);
      
      // If no book is selected and we have books, select the first one
      if (!selectedBookId && data.length > 0) {
        setSelectedBookId(data[0].id.toString());
      }
    } catch (err) {
      setError(err.message || 'Failed to load books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedBookId]);

  const fetchBookWithChapters = useCallback(async (bookId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getBookWithChapters(bookId);
      setBookWithChapters(data);
    } catch (err) {
      setError(err.message || 'Failed to load chapters');
      console.error('Error fetching chapters:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    if (selectedBookId) {
      fetchBookWithChapters(selectedBookId);
    }
  }, [selectedBookId, fetchBookWithChapters]);

  const handleBookChange = (e) => {
    const newBookId = e.target.value;
    setSelectedBookId(newBookId);
    setBookWithChapters(null);
  };

  const handleAddNew = () => {
    if (!selectedBookId) {
      alert('Please select a book first');
      return;
    }
    setEditingChapter(null);
    setShowModal(true);
  };

  const handleEdit = async (chapter) => {
    try {
      // Fetch full chapter details
      const fullChapter = await apiService.getChapterById(chapter.id);
      setEditingChapter(fullChapter);
      setShowModal(true);
    } catch (err) {
      setError(err.message || 'Failed to load chapter details');
      console.error('Error fetching chapter:', err);
    }
  };

  const handleDelete = async (chapter) => {
    if (!window.confirm(`Are you sure you want to delete chapter "${chapter.chapterTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.deleteChapter(chapter.id);
      setSuccessMessage(`Chapter "${chapter.chapterTitle}" deleted successfully`);
      fetchBookWithChapters(selectedBookId);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete chapter');
      console.error('Error deleting chapter:', err);
    }
  };

  const handlePreview = async (chapter) => {
    try {
      // Fetch full chapter details for preview
      const fullChapter = await apiService.getChapterById(chapter.id);
      setPreviewChapter(fullChapter);
    } catch (err) {
      setError(err.message || 'Failed to load chapter for preview');
      console.error('Error fetching chapter:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingChapter) {
        await apiService.updateChapter(editingChapter.id, formData);
        setSuccessMessage(`Chapter "${formData.chapterTitle}" updated successfully`);
      } else {
        await apiService.createChapter(selectedBookId, formData);
        setSuccessMessage(`Chapter "${formData.chapterTitle}" created successfully`);
      }
      
      setShowModal(false);
      setEditingChapter(null);
      fetchBookWithChapters(selectedBookId);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      throw new Error(err.message || 'Failed to save chapter');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingChapter(null);
  };

  const handleBackToBooks = () => {
    navigate('/books');
  };

  if (loading && !bookWithChapters) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={handleBackToBooks}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">Chapters Management</h1>
            <p className="page-subtitle">Manage chapters for your books</p>
          </div>
        </div>
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

      {/* Book Selector */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Select Book</h2>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <select
            className="form-select"
            value={selectedBookId}
            onChange={handleBookChange}
            style={{ fontSize: '1rem', padding: '0.75rem' }}
          >
            <option value="">-- Select a Book --</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author} ({book.totalChapters || 0} chapters)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chapters List */}
      {selectedBookId && bookWithChapters && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">{bookWithChapters.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                by {bookWithChapters.author} • {bookWithChapters.chapters?.length || 0} chapters
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleAddNew}>
              <Plus size={18} />
              Add Chapter
            </button>
          </div>

          {!bookWithChapters.chapters || bookWithChapters.chapters.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <BookOpen size={48} />
              </div>
              <div className="empty-state-title">No chapters yet</div>
              <p className="empty-state-text">
                Start by adding the first chapter to this book.
              </p>
              <button className="btn btn-primary" onClick={handleAddNew}>
                <Plus size={18} />
                Add First Chapter
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ch. #</th>
                    <th>Title</th>
                    <th>Subtitle</th>
                    <th>Word Count</th>
                    <th>Reading Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookWithChapters.chapters
                    .sort((a, b) => a.chapterNumber - b.chapterNumber)
                    .map((chapter) => (
                      <tr key={chapter.id}>
                        <td><strong>{chapter.chapterNumber}</strong></td>
                        <td>
                          <strong>{chapter.chapterTitle}</strong>
                          {chapter.summary && (
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                              {chapter.summary.substring(0, 100)}
                              {chapter.summary.length > 100 && '...'}
                            </div>
                          )}
                        </td>
                        <td>{chapter.chapterSubtitle || '-'}</td>
                        <td>{chapter.wordCount || '-'}</td>
                        <td>{chapter.readingTimeMinutes ? `${chapter.readingTimeMinutes} min` : '-'}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => handlePreview(chapter)}
                              title="Preview Chapter"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => handleEdit(chapter)}
                              title="Edit Chapter"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(chapter)}
                              title="Delete Chapter"
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
      )}

      {/* Modal for Add/Edit Chapter */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
              </h2>
              <button className="modal-close" onClick={handleCancel}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <ChapterForm
                bookId={selectedBookId}
                chapter={editingChapter}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewChapter && (
        <div className="modal-overlay" onClick={() => setPreviewChapter(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  Chapter {previewChapter.chapterNumber}: {previewChapter.chapterTitle}
                </h2>
                {previewChapter.chapterSubtitle && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {previewChapter.chapterSubtitle}
                  </p>
                )}
              </div>
              <button className="modal-close" onClick={() => setPreviewChapter(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="preview-container">
                <div dangerouslySetInnerHTML={{ __html: previewChapter.contentHtml }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setPreviewChapter(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChaptersPage;

