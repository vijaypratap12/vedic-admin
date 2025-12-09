import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ResearchPaperForm = ({ paper, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    institution: '',
    year: new Date().getFullYear(),
    category: 'research-paper',
    abstract: '',
    contentHtml: '',
    keywords: '',
    pages: 0,
    doi: '',
    journalName: '',
    volume: '',
    issueNumber: '',
    publicationDate: '',
    pdfUrl: '',
    coverImageUrl: '',
    rating: 0,
    status: 'published',
    isFeatured: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (paper) {
      setFormData({
        title: paper.title || '',
        authors: Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors || '',
        institution: paper.institution || '',
        year: paper.year || new Date().getFullYear(),
        category: paper.category || 'research-paper',
        abstract: paper.abstract || '',
        contentHtml: paper.contentHtml || '',
        keywords: Array.isArray(paper.keywords) ? paper.keywords.join(', ') : paper.keywords || '',
        pages: paper.pages || 0,
        doi: paper.doi || '',
        journalName: paper.journalName || '',
        volume: paper.volume || '',
        issueNumber: paper.issueNumber || '',
        publicationDate: paper.publicationDate ? paper.publicationDate.split('T')[0] : '',
        pdfUrl: paper.pdfUrl || '',
        coverImageUrl: paper.coverImageUrl || '',
        rating: paper.rating || 0,
        status: paper.status || 'published',
        isFeatured: paper.isFeatured || false,
      });
    }
  }, [paper]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 500) {
      newErrors.title = 'Title cannot exceed 500 characters';
    }

    if (!formData.authors.trim()) {
      newErrors.authors = 'Authors are required';
    } else if (formData.authors.length > 1000) {
      newErrors.authors = 'Authors cannot exceed 1000 characters';
    }

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    } else if (formData.institution.length > 300) {
      newErrors.institution = 'Institution cannot exceed 300 characters';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else {
      const year = parseInt(formData.year);
      if (isNaN(year) || year < 1900 || year > 2100) {
        newErrors.year = 'Year must be between 1900 and 2100';
      }
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.abstract.trim()) {
      newErrors.abstract = 'Abstract is required';
    }

    if (formData.pages < 0 || formData.pages > 10000) {
      newErrors.pages = 'Pages must be between 0 and 10000';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert comma-separated strings to proper format for API
      const submitData = {
        ...formData,
        authors: formData.authors, // Keep as string, API expects comma-separated
        keywords: formData.keywords || null,
        year: parseInt(formData.year),
        pages: parseInt(formData.pages) || 0,
        rating: parseFloat(formData.rating) || 0,
        publicationDate: formData.publicationDate || null,
        doi: formData.doi || null,
        journalName: formData.journalName || null,
        volume: formData.volume || null,
        issueNumber: formData.issueNumber || null,
        pdfUrl: formData.pdfUrl || null,
        coverImageUrl: formData.coverImageUrl || null,
        contentHtml: formData.contentHtml || null,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Failed to submit form' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'research-paper',
    'clinical-trial',
    'case-study',
    'review-article',
  ];

  const statuses = ['published', 'under-review', 'draft'];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{paper ? 'Edit Research Paper' : 'Add New Research Paper'}</h2>
          <button className="modal-close" onClick={onCancel} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.submit && (
              <div className="alert alert-error">{errors.submit}</div>
            )}
            {/* Title */}
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
                disabled={isSubmitting}
                maxLength={500}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Authors */}
            <div className="form-group">
              <label htmlFor="authors" className="form-label required">
                Authors (comma-separated)
              </label>
              <input
                type="text"
                id="authors"
                name="authors"
                className="form-input"
                value={formData.authors}
                onChange={handleChange}
                placeholder="Dr. John Doe, Dr. Jane Smith"
                disabled={isSubmitting}
                maxLength={1000}
              />
              {errors.authors && <span className="form-error">{errors.authors}</span>}
            </div>

            <div className="form-row">
              {/* Institution */}
              <div className="form-group">
                <label htmlFor="institution" className="form-label required">
                  Institution
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  className="form-input"
                  value={formData.institution}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  maxLength={300}
                />
                {errors.institution && <span className="form-error">{errors.institution}</span>}
              </div>

              {/* Year */}
              <div className="form-group">
                <label htmlFor="year" className="form-label required">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  className="form-input"
                  value={formData.year}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min={1900}
                  max={2100}
                />
                {errors.year && <span className="form-error">{errors.year}</span>}
              </div>
            </div>

            <div className="form-row">
              {/* Category */}
              <div className="form-group">
                <label htmlFor="category" className="form-label required">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace('-', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>

              {/* Pages */}
              <div className="form-group">
                <label htmlFor="pages" className="form-label">
                  Pages
                </label>
                <input
                  type="number"
                  id="pages"
                  name="pages"
                  className="form-input"
                  value={formData.pages}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min={0}
                max={10000}
                />
                {errors.pages && <span className="form-error">{errors.pages}</span>}
              </div>
            </div>

            {/* Abstract */}
            <div className="form-group">
              <label htmlFor="abstract" className="form-label required">
                Abstract
              </label>
              <textarea
                id="abstract"
                name="abstract"
                className="form-textarea"
                value={formData.abstract}
                onChange={handleChange}
                disabled={isSubmitting}
                rows={4}
              />
              {errors.abstract && <span className="form-error">{errors.abstract}</span>}
            </div>

            {/* Keywords */}
            <div className="form-group">
              <label htmlFor="keywords" className="form-label">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                className="form-input"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="Keyword1, Keyword2, Keyword3"
                disabled={isSubmitting}
                maxLength={500}
              />
            </div>

            <div className="form-row">
              {/* DOI */}
              <div className="form-group">
                <label htmlFor="doi" className="form-label">
                  DOI
                </label>
                <input
                  type="text"
                  id="doi"
                  name="doi"
                  className="form-input"
                  value={formData.doi}
                  onChange={handleChange}
                  placeholder="10.1000/xyz123"
                  disabled={isSubmitting}
                  maxLength={200}
                />
              </div>

              {/* Journal Name */}
              <div className="form-group">
                <label htmlFor="journalName" className="form-label">
                  Journal Name
                </label>
                <input
                  type="text"
                  id="journalName"
                  name="journalName"
                  className="form-input"
                  value={formData.journalName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  maxLength={300}
                />
              </div>
            </div>

            <div className="form-row">
              {/* Volume */}
              <div className="form-group">
                <label htmlFor="volume" className="form-label">
                  Volume
                </label>
                <input
                  type="text"
                  id="volume"
                  name="volume"
                  className="form-input"
                  value={formData.volume}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  maxLength={50}
                />
              </div>

              {/* Issue Number */}
              <div className="form-group">
                <label htmlFor="issueNumber" className="form-label">
                  Issue Number
                </label>
                <input
                  type="text"
                  id="issueNumber"
                  name="issueNumber"
                  className="form-input"
                  value={formData.issueNumber}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  maxLength={50}
                />
              </div>
            </div>

            <div className="form-row">
              {/* Publication Date */}
              <div className="form-group">
                <label htmlFor="publicationDate" className="form-label">
                  Publication Date
                </label>
                <input
                  type="date"
                  id="publicationDate"
                  name="publicationDate"
                  className="form-input"
                  value={formData.publicationDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Rating */}
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
                  disabled={isSubmitting}
                  min={0}
                  max={5}
                  step={0.1}
                />
                {errors.rating && <span className="form-error">{errors.rating}</span>}
              </div>
            </div>

            {/* PDF URL */}
            <div className="form-group">
              <label htmlFor="pdfUrl" className="form-label">
                PDF URL
              </label>
              <input
                type="url"
                id="pdfUrl"
                name="pdfUrl"
                className="form-input"
                value={formData.pdfUrl}
                onChange={handleChange}
                placeholder="https://example.com/paper.pdf"
                disabled={isSubmitting}
                maxLength={500}
              />
            </div>

            {/* Cover Image URL */}
            <div className="form-group">
              <label htmlFor="coverImageUrl" className="form-label">
                Cover Image URL
              </label>
              <input
                type="url"
                id="coverImageUrl"
                name="coverImageUrl"
                className="form-input"
                value={formData.coverImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/cover.jpg"
                disabled={isSubmitting}
                maxLength={500}
              />
            </div>

            {/* Content HTML */}
            <div className="form-group">
              <label htmlFor="contentHtml" className="form-label">
                Content HTML
              </label>
              <textarea
                id="contentHtml"
                name="contentHtml"
                className="form-textarea code"
                value={formData.contentHtml}
                onChange={handleChange}
                disabled={isSubmitting}
                rows={8}
                placeholder="Full paper content in HTML format..."
              />
            </div>

            <div className="form-row">
              {/* Status */}
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('-', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Is Featured */}
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <span className="form-label" style={{ marginBottom: 0 }}>Featured Paper</span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : paper ? 'Update Paper' : 'Create Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResearchPaperForm;

