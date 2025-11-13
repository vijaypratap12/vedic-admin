import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

const ChapterForm = ({ bookId, chapter, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    chapterNumber: '',
    chapterTitle: '',
    chapterSubtitle: '',
    contentHtml: '',
    summary: '',
    wordCount: '',
    readingTimeMinutes: '',
    displayOrder: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (chapter) {
      setFormData({
        chapterNumber: chapter.chapterNumber || '',
        chapterTitle: chapter.chapterTitle || '',
        chapterSubtitle: chapter.chapterSubtitle || '',
        contentHtml: chapter.contentHtml || '',
        summary: chapter.summary || '',
        wordCount: chapter.wordCount || '',
        readingTimeMinutes: chapter.readingTimeMinutes || '',
        displayOrder: chapter.displayOrder || '',
      });
    }
  }, [chapter]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.chapterNumber) {
      newErrors.chapterNumber = 'Chapter number is required';
    } else if (formData.chapterNumber < 1) {
      newErrors.chapterNumber = 'Chapter number must be positive';
    }

    if (!formData.chapterTitle.trim()) {
      newErrors.chapterTitle = 'Chapter title is required';
    } else if (formData.chapterTitle.length > 500) {
      newErrors.chapterTitle = 'Chapter title cannot exceed 500 characters';
    }

    if (formData.chapterSubtitle && formData.chapterSubtitle.length > 500) {
      newErrors.chapterSubtitle = 'Chapter subtitle cannot exceed 500 characters';
    }

    if (!formData.contentHtml.trim()) {
      newErrors.contentHtml = 'Content HTML is required';
    }

    if (formData.summary && formData.summary.length > 2000) {
      newErrors.summary = 'Summary cannot exceed 2000 characters';
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
        chapterNumber: parseInt(formData.chapterNumber),
        wordCount: formData.wordCount ? parseInt(formData.wordCount) : null,
        readingTimeMinutes: formData.readingTimeMinutes ? parseInt(formData.readingTimeMinutes) : null,
        displayOrder: formData.displayOrder ? parseInt(formData.displayOrder) : null,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: error.message || 'Failed to submit form' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.submit && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {errors.submit}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="chapterNumber" className="form-label required">
          Chapter Number
        </label>
        <input
          type="number"
          id="chapterNumber"
          name="chapterNumber"
          className="form-input"
          value={formData.chapterNumber}
          onChange={handleChange}
          placeholder="e.g., 1"
          min="1"
        />
        {errors.chapterNumber && <div className="form-error">{errors.chapterNumber}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="chapterTitle" className="form-label required">
          Chapter Title
        </label>
        <input
          type="text"
          id="chapterTitle"
          name="chapterTitle"
          className="form-input"
          value={formData.chapterTitle}
          onChange={handleChange}
          placeholder="Enter chapter title"
        />
        {errors.chapterTitle && <div className="form-error">{errors.chapterTitle}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="chapterSubtitle" className="form-label">
          Chapter Subtitle
        </label>
        <input
          type="text"
          id="chapterSubtitle"
          name="chapterSubtitle"
          className="form-input"
          value={formData.chapterSubtitle}
          onChange={handleChange}
          placeholder="Enter chapter subtitle (optional)"
        />
        {errors.chapterSubtitle && <div className="form-error">{errors.chapterSubtitle}</div>}
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label htmlFor="contentHtml" className="form-label required" style={{ marginBottom: 0 }}>
            Content HTML
          </label>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={togglePreview}
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
        
        {!showPreview ? (
          <>
            <textarea
              id="contentHtml"
              name="contentHtml"
              className="form-textarea code"
              value={formData.contentHtml}
              onChange={handleChange}
              placeholder="Enter HTML content for the chapter"
              rows="15"
            />
            {errors.contentHtml && <div className="form-error">{errors.contentHtml}</div>}
            <div className="form-help">
              Enter HTML content. Use standard HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;blockquote&gt;, etc.
            </div>
          </>
        ) : (
          <div className="preview-container">
            <div dangerouslySetInnerHTML={{ __html: formData.contentHtml }} />
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="summary" className="form-label">
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          className="form-textarea"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Enter chapter summary (optional)"
          rows="3"
        />
        {errors.summary && <div className="form-error">{errors.summary}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="wordCount" className="form-label">
            Word Count
          </label>
          <input
            type="number"
            id="wordCount"
            name="wordCount"
            className="form-input"
            value={formData.wordCount}
            onChange={handleChange}
            placeholder="e.g., 1500"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="readingTimeMinutes" className="form-label">
            Reading Time (minutes)
          </label>
          <input
            type="number"
            id="readingTimeMinutes"
            name="readingTimeMinutes"
            className="form-input"
            value={formData.readingTimeMinutes}
            onChange={handleChange}
            placeholder="e.g., 10"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="displayOrder" className="form-label">
            Display Order
          </label>
          <input
            type="number"
            id="displayOrder"
            name="displayOrder"
            className="form-input"
            value={formData.displayOrder}
            onChange={handleChange}
            placeholder="e.g., 1"
            min="0"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : chapter ? 'Update Chapter' : 'Create Chapter'}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isSubmitting}>
          <X size={18} />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ChapterForm;

