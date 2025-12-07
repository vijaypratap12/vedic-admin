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
};

export default apiService;

