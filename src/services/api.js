import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://vedicapi.azurewebsites.net/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to extract data from API response
apiClient.interceptors.response.use(
  (response) => {
    // If response has data.data structure (API wrapper), extract it
    if (response.data && response.data.data !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    // Handle errors
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// ============================================
// BOOKS API
// ============================================

/**
 * Get all books
 * @returns {Promise<Array>} List of all books
 */
export const getAllBooks = async () => {
  const response = await apiClient.get('/Books');
  return response.data;
};

/**
 * Get a book by ID
 * @param {number} id - Book ID
 * @returns {Promise<Object>} Book details
 */
export const getBookById = async (id) => {
  const response = await apiClient.get(`/Books/${id}`);
  return response.data;
};

/**
 * Create a new book
 * @param {Object} bookData - Book data (BookCreateDto)
 * @returns {Promise<Object>} Created book
 */
export const createBook = async (bookData) => {
  const response = await apiClient.post('/Books', bookData);
  return response.data;
};

/**
 * Update an existing book
 * @param {number} id - Book ID
 * @param {Object} bookData - Updated book data (BookUpdateDto)
 * @returns {Promise<Object>} Updated book
 */
export const updateBook = async (id, bookData) => {
  const response = await apiClient.put(`/Books/${id}`, bookData);
  return response.data;
};

/**
 * Delete a book
 * @param {number} id - Book ID
 * @returns {Promise<void>}
 */
export const deleteBook = async (id) => {
  await apiClient.delete(`/Books/${id}`);
};

/**
 * Get a book with all its chapters
 * @param {number} id - Book ID
 * @returns {Promise<Object>} Book with chapters
 */
export const getBookWithChapters = async (id) => {
  const response = await apiClient.get(`/Books/${id}/chapters`);
  return response.data;
};

// ============================================
// CHAPTERS API
// ============================================

/**
 * Get a chapter by ID
 * @param {number} id - Chapter ID
 * @returns {Promise<Object>} Chapter details
 */
export const getChapterById = async (id) => {
  const response = await apiClient.get(`/Chapters/${id}`);
  return response.data;
};

/**
 * Create a new chapter
 * @param {number} bookId - Book ID
 * @param {Object} chapterData - Chapter data (ChapterCreateDto)
 * @returns {Promise<Object>} Created chapter
 */
export const createChapter = async (bookId, chapterData) => {
  const response = await apiClient.post(`/Chapters/books/${bookId}`, chapterData);
  return response.data;
};

/**
 * Update an existing chapter
 * @param {number} id - Chapter ID
 * @param {Object} chapterData - Updated chapter data (ChapterUpdateDto)
 * @returns {Promise<Object>} Updated chapter
 */
export const updateChapter = async (id, chapterData) => {
  const response = await apiClient.put(`/Chapters/${id}`, chapterData);
  return response.data;
};

/**
 * Delete a chapter
 * @param {number} id - Chapter ID
 * @returns {Promise<void>}
 */
export const deleteChapter = async (id) => {
  await apiClient.delete(`/Chapters/${id}`);
};

// ============================================
// TEXTBOOKS API
// ============================================

/**
 * Get all textbooks
 * @returns {Promise<Array>} List of all textbooks
 */
export const getAllTextbooks = async () => {
  const response = await apiClient.get('/Textbooks');
  return response.data;
};

/**
 * Get active textbooks
 * @returns {Promise<Array>} List of active textbooks
 */
export const getActiveTextbooks = async () => {
  const response = await apiClient.get('/Textbooks/active');
  return response.data;
};

/**
 * Get a textbook by ID
 * @param {number} id - Textbook ID
 * @returns {Promise<Object>} Textbook details
 */
export const getTextbookById = async (id) => {
  const response = await apiClient.get(`/Textbooks/${id}`);
  return response.data;
};

/**
 * Create a new textbook
 * @param {Object} textbookData - Textbook data (TextbookCreateDto)
 * @returns {Promise<Object>} Created textbook
 */
export const createTextbook = async (textbookData) => {
  const response = await apiClient.post('/Textbooks', textbookData);
  return response.data;
};

/**
 * Update an existing textbook
 * @param {number} id - Textbook ID
 * @param {Object} textbookData - Updated textbook data (TextbookUpdateDto)
 * @returns {Promise<Object>} Updated textbook
 */
export const updateTextbook = async (id, textbookData) => {
  const response = await apiClient.put(`/Textbooks/${id}`, textbookData);
  return response.data;
};

/**
 * Delete a textbook
 * @param {number} id - Textbook ID
 * @returns {Promise<void>}
 */
export const deleteTextbook = async (id) => {
  await apiClient.delete(`/Textbooks/${id}`);
};

/**
 * Get textbooks by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} List of textbooks
 */
export const getTextbooksByCategory = async (category) => {
  const response = await apiClient.get(`/Textbooks/category/${category}`);
  return response.data;
};

/**
 * Get textbooks by level
 * @param {string} level - Level (UG/PG)
 * @returns {Promise<Array>} List of textbooks
 */
export const getTextbooksByLevel = async (level) => {
  const response = await apiClient.get(`/Textbooks/level/${level}`);
  return response.data;
};

/**
 * Search textbooks
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} List of matching textbooks
 */
export const searchTextbooks = async (searchTerm) => {
  const response = await apiClient.get(`/Textbooks/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  return response.data;
};

// ============================================
// TEXTBOOK CHAPTERS API
// ============================================

/**
 * Get a textbook with all its chapters
 * @param {number} id - Textbook ID
 * @returns {Promise<Object>} Textbook with chapters
 */
export const getTextbookWithChapters = async (id) => {
  const response = await apiClient.get(`/Textbooks/${id}/chapters`);
  return response.data;
};

/**
 * Get a textbook chapter by ID
 * @param {number} id - Chapter ID
 * @returns {Promise<Object>} Chapter details
 */
export const getTextbookChapterById = async (id) => {
  const response = await apiClient.get(`/TextbookChapters/${id}`);
  return response.data;
};

/**
 * Create a new textbook chapter
 * @param {number} textbookId - Textbook ID
 * @param {Object} chapterData - Chapter data
 * @returns {Promise<Object>} Created chapter
 */
export const createTextbookChapter = async (textbookId, chapterData) => {
  const response = await apiClient.post(`/TextbookChapters/textbooks/${textbookId}`, chapterData);
  return response.data;
};

/**
 * Update an existing textbook chapter
 * @param {number} id - Chapter ID
 * @param {Object} chapterData - Updated chapter data
 * @returns {Promise<Object>} Updated chapter
 */
export const updateTextbookChapter = async (id, chapterData) => {
  const response = await apiClient.put(`/TextbookChapters/${id}`, chapterData);
  return response.data;
};

/**
 * Delete a textbook chapter
 * @param {number} id - Chapter ID
 * @returns {Promise<void>}
 */
export const deleteTextbookChapter = async (id) => {
  await apiClient.delete(`/TextbookChapters/${id}`);
};

// ============================================
// RESEARCH PAPERS API
// ============================================

/**
 * Get all research papers
 * @returns {Promise<Array>} List of all research papers
 */
export const getAllResearchPapers = async () => {
  const response = await apiClient.get('/ResearchPapers');
  return response.data;
};

/**
 * Get featured research papers
 * @param {number} count - Number of featured papers to retrieve
 * @returns {Promise<Array>} List of featured research papers
 */
export const getFeaturedResearchPapers = async (count = 3) => {
  const response = await apiClient.get(`/ResearchPapers/featured?count=${count}`);
  return response.data;
};

/**
 * Get a research paper by ID
 * @param {number} id - Research Paper ID
 * @returns {Promise<Object>} Research paper details
 */
export const getResearchPaperById = async (id) => {
  const response = await apiClient.get(`/ResearchPapers/${id}`);
  return response.data;
};

/**
 * Create a new research paper
 * @param {Object} paperData - Research paper data
 * @returns {Promise<Object>} Created research paper
 */
export const createResearchPaper = async (paperData) => {
  const response = await apiClient.post('/ResearchPapers', paperData);
  return response.data;
};

/**
 * Update an existing research paper
 * @param {number} id - Research Paper ID
 * @param {Object} paperData - Updated research paper data
 * @returns {Promise<Object>} Updated research paper
 */
export const updateResearchPaper = async (id, paperData) => {
  const response = await apiClient.put(`/ResearchPapers/${id}`, paperData);
  return response.data;
};

/**
 * Delete a research paper
 * @param {number} id - Research Paper ID
 * @returns {Promise<void>}
 */
export const deleteResearchPaper = async (id) => {
  await apiClient.delete(`/ResearchPapers/${id}`);
};

/**
 * Get research papers by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} List of research papers
 */
export const getResearchPapersByCategory = async (category) => {
  const response = await apiClient.get(`/ResearchPapers/category/${encodeURIComponent(category)}`);
  return response.data;
};

/**
 * Search research papers
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} List of matching research papers
 */
export const searchResearchPapers = async (searchTerm) => {
  const response = await apiClient.get(`/ResearchPapers/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  return response.data;
};

// ============================================
// THESIS API
// ============================================

/**
 * Get all thesis
 * @returns {Promise<Array>} List of all thesis
 */
export const getAllThesis = async () => {
  const response = await apiClient.get('/Thesis');
  return response.data;
};

/**
 * Get featured thesis
 * @param {number} count - Number of featured thesis to retrieve
 * @returns {Promise<Array>} List of featured thesis
 */
export const getFeaturedThesis = async (count = 3) => {
  const response = await apiClient.get(`/Thesis/featured?count=${count}`);
  return response.data;
};

/**
 * Get a thesis by ID
 * @param {number} id - Thesis ID
 * @returns {Promise<Object>} Thesis details
 */
export const getThesisById = async (id) => {
  const response = await apiClient.get(`/Thesis/${id}`);
  return response.data;
};

/**
 * Create a new thesis
 * @param {Object} thesisData - Thesis data
 * @returns {Promise<Object>} Created thesis
 */
export const createThesis = async (thesisData) => {
  const response = await apiClient.post('/Thesis', thesisData);
  return response.data;
};

/**
 * Update an existing thesis
 * @param {number} id - Thesis ID
 * @param {Object} thesisData - Updated thesis data
 * @returns {Promise<Object>} Updated thesis
 */
export const updateThesis = async (id, thesisData) => {
  const response = await apiClient.put(`/Thesis/${id}`, thesisData);
  return response.data;
};

/**
 * Delete a thesis
 * @param {number} id - Thesis ID
 * @returns {Promise<void>}
 */
export const deleteThesis = async (id) => {
  await apiClient.delete(`/Thesis/${id}`);
};

/**
 * Get thesis by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} List of thesis
 */
export const getThesisByCategory = async (category) => {
  const response = await apiClient.get(`/Thesis/category/${encodeURIComponent(category)}`);
  return response.data;
};

/**
 * Search thesis
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} List of matching thesis
 */
export const searchThesis = async (searchTerm) => {
  const response = await apiClient.get(`/Thesis/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  return response.data;
};

// ============================================
// CONTACT SUBMISSIONS API
// ============================================

/**
 * Get all contact submissions
 * @returns {Promise<Array>} List of all contact submissions
 */
export const getAllContactSubmissions = async () => {
  const response = await apiClient.get('/Contact');
  return response.data;
};

/**
 * Get contact submission by ID
 * @param {string} id - Contact submission ID (GUID)
 * @returns {Promise<Object>} Contact submission details
 */
export const getContactSubmissionById = async (id) => {
  const response = await apiClient.get(`/Contact/${id}`);
  return response.data;
};

/**
 * Get contact submissions by status
 * @param {string} status - Status (Pending, InProgress, Resolved, Closed)
 * @returns {Promise<Array>} List of contact submissions
 */
export const getContactSubmissionsByStatus = async (status) => {
  const response = await apiClient.get(`/Contact/status/${status}`);
  return response.data;
};

/**
 * Get contact submissions by type
 * @param {string} type - Contact type
 * @returns {Promise<Array>} List of contact submissions
 */
export const getContactSubmissionsByType = async (type) => {
  const response = await apiClient.get(`/Contact/type/${type}`);
  return response.data;
};

/**
 * Update contact submission
 * @param {string} id - Contact submission ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated contact submission
 */
export const updateContactSubmission = async (id, updateData) => {
  const response = await apiClient.put(`/Contact/${id}`, updateData);
  return response.data;
};

/**
 * Delete contact submission
 * @param {string} id - Contact submission ID
 * @returns {Promise<void>}
 */
export const deleteContactSubmission = async (id) => {
  await apiClient.delete(`/Contact/${id}`);
};

// ============================================
// NEWSLETTER SUBSCRIPTIONS API
// ============================================

/**
 * Get all newsletter subscriptions
 * @returns {Promise<Array>} List of all newsletter subscriptions
 */
export const getAllNewsletterSubscriptions = async () => {
  const response = await apiClient.get('/Newsletter/active');
  return response.data;
};

/**
 * Get active newsletter subscriptions
 * @returns {Promise<Array>} List of active newsletter subscriptions
 */
export const getActiveNewsletterSubscriptions = async () => {
  const response = await apiClient.get('/Newsletter/active');
  return response.data;
};

/**
 * Get newsletter subscription by ID
 * @param {string} id - Newsletter subscription ID (GUID)
 * @returns {Promise<Object>} Newsletter subscription details
 */
export const getNewsletterSubscriptionById = async (id) => {
  const response = await apiClient.get(`/Newsletter/${id}`);
  return response.data;
};

/**
 * Unsubscribe email from newsletter
 * @param {string} id - Newsletter subscription ID
 * @returns {Promise<void>}
 */
export const unsubscribeNewsletter = async (id) => {
  await apiClient.post(`/Newsletter/${id}/unsubscribe`);
};

/**
 * Delete newsletter subscription
 * @param {string} id - Newsletter subscription ID
 * @returns {Promise<void>}
 */
export const deleteNewsletterSubscription = async (id) => {
  await apiClient.delete(`/Newsletter/${id}`);
};

// Export all functions as default
const apiService = {
  // Books
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBookWithChapters,
  // Chapters
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
  // Textbooks
  getAllTextbooks,
  getActiveTextbooks,
  getTextbookById,
  createTextbook,
  updateTextbook,
  deleteTextbook,
  getTextbooksByCategory,
  getTextbooksByLevel,
  searchTextbooks,
  getTextbookWithChapters,
  // Textbook Chapters
  getTextbookChapterById,
  createTextbookChapter,
  updateTextbookChapter,
  deleteTextbookChapter,
  // Research Papers
  getAllResearchPapers,
  getFeaturedResearchPapers,
  getResearchPaperById,
  createResearchPaper,
  updateResearchPaper,
  deleteResearchPaper,
  getResearchPapersByCategory,
  searchResearchPapers,
  // Thesis
  getAllThesis,
  getFeaturedThesis,
  getThesisById,
  createThesis,
  updateThesis,
  deleteThesis,
  getThesisByCategory,
  searchThesis,
  // Contact Submissions
  getAllContactSubmissions,
  getContactSubmissionById,
  getContactSubmissionsByStatus,
  getContactSubmissionsByType,
  updateContactSubmission,
  deleteContactSubmission,
  // Newsletter Subscriptions
  getAllNewsletterSubscriptions,
  getActiveNewsletterSubscriptions,
  getNewsletterSubscriptionById,
  unsubscribeNewsletter,
  deleteNewsletterSubscription,
};

export default apiService;

