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
  const payload = {
    ...chapterData,
    bookId: bookId,
  };
  const response = await apiClient.post('/Chapters', payload);
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
};

export default apiService;

