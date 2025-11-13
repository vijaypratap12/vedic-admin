import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BookForm = ({ book, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    coverImageUrl: '',
    category: '',
    language: '',
    publicationYear: '',
    isbn: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        description: book.description || '',
        coverImageUrl: book.coverImageUrl || '',
        category: book.category || '',
        language: book.language || '',
        publicationYear: book.publicationYear || '',
        isbn: book.isbn || '',
      });
    }
  }, [book]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 500) {
      newErrors.title = 'Title cannot exceed 500 characters';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    } else if (formData.author.length > 200) {
      newErrors.author = 'Author name cannot exceed 200 characters';
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }

    if (formData.coverImageUrl && formData.coverImageUrl.length > 500) {
      newErrors.coverImageUrl = 'Cover image URL cannot exceed 500 characters';
    }

    if (formData.category && formData.category.length > 100) {
      newErrors.category = 'Category cannot exceed 100 characters';
    }

    if (formData.language && formData.language.length > 50) {
      newErrors.language = 'Language cannot exceed 50 characters';
    }

    if (formData.publicationYear) {
      const year = parseInt(formData.publicationYear);
      if (isNaN(year) || year < 1 || year > 9999) {
        newErrors.publicationYear = 'Publication year must be between 1 and 9999';
      }
    }

    if (formData.isbn && formData.isbn.length > 20) {
      newErrors.isbn = 'ISBN cannot exceed 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : null,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: error.message || 'Failed to submit form' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.submit && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {errors.submit}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title" className="form-label required">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-input"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter book title"
        />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="author" className="form-label required">
          Author
        </label>
        <input
          type="text"
          id="author"
          name="author"
          className="form-input"
          value={formData.author}
          onChange={handleChange}
          placeholder="Enter author name"
        />
        {errors.author && <div className="form-error">{errors.author}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="form-textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter book description"
          rows="4"
        />
        {errors.description && <div className="form-error">{errors.description}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="coverImageUrl" className="form-label">
          Cover Image URL
        </label>
        <input
          type="text"
          id="coverImageUrl"
          name="coverImageUrl"
          className="form-input"
          value={formData.coverImageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
        {errors.coverImageUrl && <div className="form-error">{errors.coverImageUrl}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          className="form-input"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g., Ayurveda, Surgery"
        />
        {errors.category && <div className="form-error">{errors.category}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="language" className="form-label">
          Language
        </label>
        <input
          type="text"
          id="language"
          name="language"
          className="form-input"
          value={formData.language}
          onChange={handleChange}
          placeholder="e.g., Sanskrit, English"
        />
        {errors.language && <div className="form-error">{errors.language}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="publicationYear" className="form-label">
          Publication Year
        </label>
        <input
          type="number"
          id="publicationYear"
          name="publicationYear"
          className="form-input"
          value={formData.publicationYear}
          onChange={handleChange}
          placeholder="e.g., 2024"
          min="1"
          max="9999"
        />
        {errors.publicationYear && <div className="form-error">{errors.publicationYear}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="isbn" className="form-label">
          ISBN
        </label>
        <input
          type="text"
          id="isbn"
          name="isbn"
          className="form-input"
          value={formData.isbn}
          onChange={handleChange}
          placeholder="e.g., 978-3-16-148410-0"
        />
        {errors.isbn && <div className="form-error">{errors.isbn}</div>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : book ? 'Update Book' : 'Create Book'}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isSubmitting}>
          <X size={18} />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BookForm;

