import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ThesisForm = ({ thesis, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    guideNames: '',
    institution: '',
    department: '',
    year: new Date().getFullYear(),
    category: 'MS Thesis',
    thesisType: 'Thesis',
    abstract: '',
    contentHtml: '',
    keywords: '',
    pages: 0,
    submissionDate: '',
    approvalDate: '',
    defenseDate: '',
    grade: '',
    pdfUrl: '',
    coverImageUrl: '',
    universityRegistrationNumber: '',
    rating: 0,
    status: 'published',
    isFeatured: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (thesis) {
      setFormData({
        title: thesis.title || '',
        author: thesis.author || '',
        guideNames: Array.isArray(thesis.guideNames) ? thesis.guideNames.join(', ') : thesis.guideNames || '',
        institution: thesis.institution || '',
        department: thesis.department || '',
        year: thesis.year || new Date().getFullYear(),
        category: thesis.category || 'MS Thesis',
        thesisType: thesis.thesisType || 'Thesis',
        abstract: thesis.abstract || '',
        contentHtml: thesis.contentHtml || '',
        keywords: Array.isArray(thesis.keywords) ? thesis.keywords.join(', ') : thesis.keywords || '',
        pages: thesis.pages || 0,
        submissionDate: thesis.submissionDate ? thesis.submissionDate.split('T')[0] : '',
        approvalDate: thesis.approvalDate ? thesis.approvalDate.split('T')[0] : '',
        defenseDate: thesis.defenseDate ? thesis.defenseDate.split('T')[0] : '',
        grade: thesis.grade || '',
        pdfUrl: thesis.pdfUrl || '',
        coverImageUrl: thesis.coverImageUrl || '',
        universityRegistrationNumber: thesis.universityRegistrationNumber || '',
        rating: thesis.rating || 0,
        status: thesis.status || 'published',
        isFeatured: thesis.isFeatured || false,
      });
    }
  }, [thesis]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 500) {
      newErrors.title = 'Title cannot exceed 500 characters';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    } else if (formData.author.length > 300) {
      newErrors.author = 'Author cannot exceed 300 characters';
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
        guideNames: formData.guideNames || null, // Keep as string, API expects comma-separated
        keywords: formData.keywords || null,
        year: parseInt(formData.year),
        pages: parseInt(formData.pages) || 0,
        rating: parseFloat(formData.rating) || 0,
        submissionDate: formData.submissionDate || null,
        approvalDate: formData.approvalDate || null,
        defenseDate: formData.defenseDate || null,
        department: formData.department || null,
        thesisType: formData.thesisType || null,
        grade: formData.grade || null,
        pdfUrl: formData.pdfUrl || null,
        coverImageUrl: formData.coverImageUrl || null,
        universityRegistrationNumber: formData.universityRegistrationNumber || null,
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
    'PhD Thesis',
    'MS Thesis',
    'MD Thesis',
    'Post-Doctoral',
  ];

  const thesisTypes = ['Dissertation', 'Thesis', 'Research Project'];
  const grades = ['Excellent', 'Very Good', 'Good', 'Pass'];
  const statuses = ['published', 'under-review', 'draft'];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{thesis ? 'Edit Thesis' : 'Add New Thesis'}</h2>
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

            <div className="form-row">
              {/* Author */}
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
                  disabled={isSubmitting}
                  maxLength={300}
                />
                {errors.author && <span className="form-error">{errors.author}</span>}
              </div>

              {/* Guide Names */}
              <div className="form-group">
                <label htmlFor="guideNames" className="form-label">
                  Guide Names (comma-separated)
                </label>
                <input
                  type="text"
                  id="guideNames"
                  name="guideNames"
                  className="form-input"
                  value={formData.guideNames}
                  onChange={handleChange}
                  placeholder="Prof. John Doe, Dr. Jane Smith"
                  disabled={isSubmitting}
                  maxLength={500}
                />
              </div>
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

              {/* Department */}
              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  maxLength={200}
                />
              </div>
            </div>

            <div className="form-row">
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
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>
            </div>

            <div className="form-row">
              {/* Thesis Type */}
              <div className="form-group">
                <label htmlFor="thesisType" className="form-label">
                  Thesis Type
                </label>
                <select
                  id="thesisType"
                  name="thesisType"
                  className="form-select"
                  value={formData.thesisType}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">Select Type</option>
                  {thesisTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
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
                className={`form-textarea ${errors.abstract ? 'error' : ''}`}
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

            {/* Submission Date */}
            <div className="form-group">
              <label htmlFor="submissionDate" className="form-label">
                Submission Date
              </label>
              <input
                type="date"
                id="submissionDate"
                name="submissionDate"
                className="form-input"
                value={formData.submissionDate}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Approval Date */}
            <div className="form-group">
              <label htmlFor="approvalDate" className="form-label">
                Approval Date
              </label>
              <input
                type="date"
                id="approvalDate"
                name="approvalDate"
                className="form-input"
                value={formData.approvalDate}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Defense Date */}
            <div className="form-group">
              <label htmlFor="defenseDate" className="form-label">
                Defense Date
              </label>
              <input
                type="date"
                id="defenseDate"
                name="defenseDate"
                className="form-input"
                value={formData.defenseDate}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Grade */}
            <div className="form-group">
              <label htmlFor="grade" className="form-label">
                Grade
              </label>
              <select
                id="grade"
                name="grade"
                className="form-input"
                value={formData.grade}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* University Registration Number */}
            <div className="form-group">
              <label htmlFor="universityRegistrationNumber" className="form-label">
                University Registration Number
              </label>
              <input
                type="text"
                id="universityRegistrationNumber"
                name="universityRegistrationNumber"
                className="form-input"
                value={formData.universityRegistrationNumber}
                onChange={handleChange}
                disabled={isSubmitting}
                maxLength={100}
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
                className={`form-input ${errors.rating ? 'error' : ''}`}
                value={formData.rating}
                onChange={handleChange}
                disabled={isSubmitting}
                min={0}
                max={5}
                step={0.1}
              />
              {errors.rating && <span className="form-error">{errors.rating}</span>}
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
                placeholder="https://example.com/thesis.pdf"
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
                placeholder="Full thesis content in HTML format..."
              />
            </div>

            {/* Status */}
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
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <span>Featured Thesis</span>
              </label>
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
              {isSubmitting ? 'Saving...' : thesis ? 'Update Thesis' : 'Create Thesis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThesisForm;

