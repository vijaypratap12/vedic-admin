# Vedic AI Admin Panel

A standalone React admin panel for managing books and chapters in the Vedic AI system.

## Features

- **Dashboard**: Overview of books and chapters with quick actions
- **Books Management**: Create, read, update, and delete books
- **Chapters Management**: Create, read, update, and delete chapters for each book
- **HTML Content Editor**: Simple textarea for HTML content with live preview
- **Search & Filter**: Search books by title, author, or category
- **Responsive Design**: Clean, modern interface that works on all devices

## Prerequisites

Before running the admin panel, ensure you have:

- Node.js (v14 or higher)
- npm or yarn
- VedicAPI.API backend running on `https://localhost:7135`

## Installation

1. Navigate to the admin panel directory:
```bash
cd vedic-admin
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API URL (if different from default):
   - Edit `.env` file
   - Update `REACT_APP_API_URL` to your API endpoint

## Running the Application

Start the development server:

```bash
npm start
```

The admin panel will open at `http://localhost:3001`

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
REACT_APP_API_URL=https://localhost:7135/api
```

- `PORT`: Port number for the admin panel (default: 3001)
- `REACT_APP_API_URL`: Base URL for the VedicAPI.API backend

### API Endpoints

The admin panel connects to the following API endpoints:

**Books:**
- `GET /api/Books` - Get all books
- `GET /api/Books/{id}` - Get book by ID
- `POST /api/Books` - Create new book
- `PUT /api/Books/{id}` - Update book
- `DELETE /api/Books/{id}` - Delete book
- `GET /api/Books/{id}/chapters` - Get book with chapters

**Chapters:**
- `GET /api/Chapters/{id}` - Get chapter by ID
- `POST /api/Chapters` - Create new chapter
- `PUT /api/Chapters/{id}` - Update chapter
- `DELETE /api/Chapters/{id}` - Delete chapter

## Usage Guide

### Managing Books

1. **View All Books**
   - Navigate to "Books" from the main menu
   - View list of all books with details
   - Use search bar to filter books

2. **Add New Book**
   - Click "Add New Book" button
   - Fill in required fields (Title, Author)
   - Optionally add description, category, language, etc.
   - Click "Create Book"

3. **Edit Book**
   - Click the edit icon (pencil) next to a book
   - Update the desired fields
   - Click "Update Book"

4. **Delete Book**
   - Click the delete icon (trash) next to a book
   - Confirm deletion in the dialog
   - Note: This will also delete all chapters associated with the book

### Managing Chapters

1. **Access Chapters**
   - From Books page, click the book icon next to a book
   - Or navigate to "Chapters" and select a book from dropdown

2. **Add New Chapter**
   - Select a book first
   - Click "Add Chapter" button
   - Fill in required fields:
     - Chapter Number (e.g., 1, 2, 3)
     - Chapter Title
     - Content HTML (use HTML tags for formatting)
   - Optionally add subtitle, summary, word count, etc.
   - Click "Create Chapter"

3. **Edit Chapter**
   - Click the edit icon next to a chapter
   - Update the desired fields
   - Use "Show Preview" to see rendered HTML
   - Click "Update Chapter"

4. **Preview Chapter**
   - Click the eye icon next to a chapter
   - View the rendered HTML content
   - Close preview when done

5. **Delete Chapter**
   - Click the delete icon next to a chapter
   - Confirm deletion in the dialog

### HTML Content Guidelines

When adding chapter content, use standard HTML tags:

```html
<h2>Main Heading</h2>
<p>Paragraph text goes here.</p>

<h3>Subheading</h3>
<p>More content...</p>

<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>

<blockquote>
  <p>Quote text</p>
  <em>- Author Name</em>
</blockquote>
```

Supported HTML tags:
- Headings: `<h2>`, `<h3>`, `<h4>`
- Paragraphs: `<p>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Emphasis: `<strong>`, `<em>`
- Quotes: `<blockquote>`
- Line breaks: `<br>`

## Project Structure

```
vedic-admin/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BookForm.js       # Book create/edit form
│   │   └── ChapterForm.js    # Chapter create/edit form
│   ├── pages/
│   │   ├── Dashboard.js      # Dashboard page
│   │   ├── BooksPage.js      # Books management
│   │   └── ChaptersPage.js   # Chapters management
│   ├── services/
│   │   └── api.js            # API service layer
│   ├── styles/
│   │   └── admin.css         # Admin panel styles
│   ├── App.js                # Main app with routing
│   ├── index.js              # Entry point
│   └── index.css             # Global styles
├── .env                      # Environment variables
├── package.json
└── README.md
```

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `build/` directory.

## Troubleshooting

### API Connection Issues

If you see "Failed to load books" or similar errors:

1. Ensure VedicAPI.API is running on the correct port
2. Check the API URL in `.env` file
3. Verify CORS is enabled in the API
4. Check browser console for detailed error messages

### Port Already in Use

If port 3001 is already in use:

1. Edit `.env` file and change `PORT` to another number
2. Or stop the process using port 3001

### SSL Certificate Errors

If using HTTPS with self-signed certificates:

1. Accept the certificate in your browser
2. Navigate to the API URL directly and accept the certificate
3. Then return to the admin panel

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

### Adding New Features

The admin panel uses:
- React 18
- React Router v6 for routing
- Axios for API calls
- Lucide React for icons
- Plain CSS for styling

## Security Notes

**Important**: This admin panel has no authentication. It should only be used in:
- Development environments
- Internal networks
- Behind a VPN or firewall
- With proper authentication added before production use

## Support

For issues or questions:
1. Check the API logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure the database is accessible and has the correct schema

## License

This project is part of the Vedic AI system.
