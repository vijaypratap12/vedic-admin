import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TextbookForm = ({ textbook, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    coverImageUrl: '',
    category: '',
    language: '',
    publicationYear: '',
    isbn: '',
    rating: '',
    status: 'completed',
    tags: '',
    level: '',
    year: '',
    pageCount: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (textbook) {
      setFormData({
        title: textbook.title || '',
        author: textbook.author || '',
        description: textbook.description || '',
        coverImageUrl: textbook.coverImageUrl || '',
        category: textbook.category || '',
        language: textbook.language || '',
        publicationYear: textbook.publicationYear || '',
        isbn: textbook.isbn || '',
        rating: textbook.rating || '',
        status: textbook.status || 'completed',
        tags: textbook.tags || '',
        level: textbook.level || '',
        year: textbook.year || '',
        pageCount: textbook.pageCount || '',
      });
    }
  }, [textbook]);

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

    if (formData.rating) {
      const rating = parseFloat(formData.rating);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        newErrors.rating = 'Rating must be between 0 and 5';
      }
    }

    if (formData.status && formData.status.length > 50) {
      newErrors.status = 'Status cannot exceed 50 characters';
    }

    if (formData.tags && formData.tags.length > 1000) {
      newErrors.tags = 'Tags cannot exceed 1000 characters';
    }

    if (formData.level && formData.level.length > 50) {
      newErrors.level = 'Level cannot exceed 50 characters';
    }

    if (formData.year && formData.year.length > 50) {
      newErrors.year = 'Year cannot exceed 50 characters';
    }

    if (formData.pageCount) {
      const pages = parseInt(formData.pageCount);
      if (isNaN(pages) || pages < 1 || pages > 10000) {
        newErrors.pageCount = 'Page count must be between 1 and 10000';
      }
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
        rating: formData.rating ? parseFloat(formData.rating) : null,
        pageCount: formData.pageCount ? parseInt(formData.pageCount) : null,
        // For update, include additional fields
        ...(textbook && {
          totalChapters: textbook.totalChapters || 0,
          isActive: textbook.isActive !== undefined ? textbook.isActive : true,
        }),
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
          placeholder="Enter textbook title"
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
          placeholder="Enter textbook description"
          rows="4"
        />
        {errors.description && <div className="form-error">{errors.description}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="level" className="form-label">
            Level
          </label>
          <select
            id="level"
            name="level"
            className="form-input"
            value={formData.level}
            onChange={handleChange}
          >
            <option value="">Select Level</option>
            <option value="UG">UG (Undergraduate)</option>
            <option value="PG">PG (Postgraduate)</option>
            <option value="Reference">Reference</option>
          </select>
          {errors.level && <div className="form-error">{errors.level}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="year" className="form-label">
            Year
          </label>
          <input
            type="text"
            id="year"
            name="year"
            className="form-input"
            value={formData.year}
            onChange={handleChange}
            placeholder="e.g., 1st Year, 2nd Year PG"
          />
          {errors.year && <div className="form-error">{errors.year}</div>}
        </div>
      </div>

      <div className="form-row">
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
            placeholder="e.g., Surgery, Medicine, Research"
          />
          {errors.category && <div className="form-error">{errors.category}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="form-input"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="planned">Planned</option>
          </select>
          {errors.status && <div className="form-error">{errors.status}</div>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="tags" className="form-label">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          className="form-input"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g., Basic Principles, History, Instruments"
        />
        {errors.tags && <div className="form-error">{errors.tags}</div>}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Separate multiple tags with commas
        </div>
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

      <div className="form-row">
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
            placeholder="e.g., English, Hindi, Sanskrit"
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
      </div>

      <div className="form-row">
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

        <div className="form-group">
          <label htmlFor="pageCount" className="form-label">
            Page Count
          </label>
          <input
            type="number"
            id="pageCount"
            name="pageCount"
            className="form-input"
            value={formData.pageCount}
            onChange={handleChange}
            placeholder="e.g., 300"
            min="1"
            max="10000"
          />
          {errors.pageCount && <div className="form-error">{errors.pageCount}</div>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="rating" className="form-label">
          Rating (0-5)
        </label>
        <input
          type="number"
          id="rating"
          name="rating"
          className="form-input"
          value={formData.rating}
          onChange={handleChange}
          placeholder="e.g., 4.5"
          min="0"
          max="5"
          step="0.1"
        />
        {errors.rating && <div className="form-error">{errors.rating}</div>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : textbook ? 'Update Textbook' : 'Create Textbook'}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isSubmitting}>
          <X size={18} />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TextbookForm;

