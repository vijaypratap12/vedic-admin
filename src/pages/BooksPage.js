import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, BookOpen, Search, X } from 'lucide-react';
import apiService from '../services/api';
import BookForm from '../components/BookForm';
import '../styles/admin.css';

const BooksPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchBooks();
    
    // Check if we should open the form
    const action = searchParams.get('action');
    if (action === 'new') {
      handleAddNew();
    }
  }, [searchParams]);

  useEffect(() => {
    // Filter books based on search term
    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          (book.category && book.category.toLowerCase().includes(term))
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      setError(err.message || 'Failed to load books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingBook(null);
    setShowModal(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.deleteBook(book.id);
      setSuccessMessage(`Book "${book.title}" deleted successfully`);
      fetchBooks();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete book');
      console.error('Error deleting book:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingBook) {
        await apiService.updateBook(editingBook.id, formData);
        setSuccessMessage(`Book "${formData.title}" updated successfully`);
      } else {
        await apiService.createBook(formData);
        setSuccessMessage(`Book "${formData.title}" created successfully`);
      }
      
      setShowModal(false);
      setEditingBook(null);
      fetchBooks();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      throw new Error(err.message || 'Failed to save book');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  const handleViewChapters = (bookId) => {
    navigate(`/books/${bookId}/chapters`);
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
        <h1 className="page-title">Books Management</h1>
        <p className="page-subtitle">Manage all books in the system</p>
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
          <h2 className="card-title">All Books ({filteredBooks.length})</h2>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <Plus size={18} />
            Add New Book
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, author, or category..."
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

        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BookOpen size={48} />
            </div>
            <div className="empty-state-title">
              {searchTerm ? 'No books found' : 'No books yet'}
            </div>
            <p className="empty-state-text">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start by adding your first book to the system.'}
            </p>
            {!searchTerm && (
              <button className="btn btn-primary" onClick={handleAddNew}>
                <Plus size={18} />
                Add First Book
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
                  <th>Category</th>
                  <th>Language</th>
                  <th>Chapters</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <strong>{book.title}</strong>
                      {book.description && (
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          {book.description.substring(0, 100)}
                          {book.description.length > 100 && '...'}
                        </div>
                      )}
                    </td>
                    <td>{book.author}</td>
                    <td>{book.category || '-'}</td>
                    <td>{book.language || '-'}</td>
                    <td>{book.totalChapters || 0}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleViewChapters(book.id)}
                          title="View Chapters"
                        >
                          <BookOpen size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEdit(book)}
                          title="Edit Book"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(book)}
                          title="Delete Book"
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

      {/* Modal for Add/Edit Book */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button className="modal-close" onClick={handleCancel}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <BookForm
                book={editingBook}
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

export default BooksPage;

