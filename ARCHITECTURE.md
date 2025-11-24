# 🏗️ Architecture Documentation

## System Overview

The AI Book Generator is a full-stack web application built with a modern, scalable architecture.

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   React Frontend  │
                    │   (Port 3000)     │
                    │  - React Router   │
                    │  - Tailwind CSS   │
                    │  - Shadcn/ui      │
                    └────────┬──────────┘
                             │
                    HTTP/REST API
                             │
                    ┌────────▼──────────┐
                    │  FastAPI Backend  │
                    │   (Port 8001)     │
                    │  - API Routes     │
                    │  - Business Logic │
                    │  - AI Integration │
                    └────────┬──────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     ┌────────▼─────────┐        ┌─────────▼────────┐
     │  MongoDB Database │        │ Emergent LLM API │
     │  - Book Storage   │        │ - AI Generation  │
     │  - User Data      │        │ - gpt-4o-mini    │
     └──────────────────┘        └──────────────────┘
```

---

## Technology Stack

### Frontend Layer
```
React 19
├── React Router DOM v7 (Routing)
├── Axios (HTTP Client)
├── Tailwind CSS (Styling)
├── Shadcn/ui (Component Library)
│   ├── Button
│   ├── Card
│   ├── Input
│   ├── Slider
│   └── Toast (Sonner)
└── Lucide React (Icons)
```

### Backend Layer
```
FastAPI
├── Uvicorn (ASGI Server)
├── Pydantic (Data Validation)
├── Motor (Async MongoDB Driver)
├── python-dotenv (Environment Config)
└── Emergent Integrations (AI)
    └── LiteLLM (Multi-Provider Support)
```

### Data Layer
```
MongoDB
├── Collections:
│   └── books
│       ├── id (string, UUID)
│       ├── title (string)
│       ├── content (string)
│       ├── page_count (integer)
│       └── created_at (datetime)
└── Indexes:
    └── created_at (descending)
```

---

## Component Architecture

### Frontend Components

```
App.js (Root)
├── BrowserRouter
│   └── Routes
│       ├── Home (/)            [Landing Page]
│       ├── GenerateBook        [/generate]
│       ├── BooksLibrary        [/books]
│       └── BookViewer          [/book/:bookId]
└── Toaster (Global Notifications)
```

#### Component Details

**Home Component**
- Hero section with call-to-action
- Feature highlights
- Navigation to generation and library

**GenerateBook Component**
- Title input field
- Page count slider (1-50)
- Generation button with loading state
- Redirects to BookViewer on success

**BooksLibrary Component**
- Grid layout of book cards
- Fetches all books on mount
- Delete functionality
- Navigation to individual books

**BookViewer Component**
- Displays full book content
- Page-structured view
- Metadata display
- Navigation back to library

### Backend Routes

```python
/api/
├── GET  /                     [Health Check]
├── POST /books/generate       [Generate New Book]
├── GET  /books               [List All Books]
├── GET  /books/{book_id}     [Get Single Book]
└── DELETE /books/{book_id}   [Delete Book]
```

---

## Data Flow

### Book Generation Flow

```
1. User Input
   └─> React: GenerateBook component
       ├─> Validates title (not empty)
       └─> Validates page_count (1-50)

2. API Request
   └─> POST /api/books/generate
       {
         "title": "My Book",
         "page_count": 10
       }

3. Backend Processing
   └─> FastAPI: generate_book()
       ├─> Initialize LLM Chat
       ├─> Create prompt with title & page count
       ├─> Call AI API (gpt-4o-mini)
       ├─> Receive generated content
       ├─> Create Book object
       ├─> Save to MongoDB
       └─> Return BookResponse

4. Frontend Response
   └─> React: Receives book data
       ├─> Shows success toast
       └─> Navigates to /book/{id}

5. Display
   └─> React: BookViewer component
       └─> Fetches and displays book
```

### Book Retrieval Flow

```
1. Library View
   └─> React: BooksLibrary component
       └─> useEffect() on mount

2. API Request
   └─> GET /api/books

3. Backend Processing
   └─> FastAPI: get_books()
       ├─> Query MongoDB (sorted by created_at DESC)
       ├─> Limit 100 books
       └─> Return List[BookResponse]

4. Frontend Response
   └─> React: Updates books state
       └─> Renders book cards
```

---

## Database Schema

### Books Collection

```javascript
{
  "id": "uuid-string",           // Primary key, UUID v4
  "title": "string",             // Book title
  "content": "string",           // Full book text
  "page_count": 10,               // Number of pages
  "created_at": "ISO-8601"       // Timestamp
}

// Indexes
{ "created_at": -1 }              // For sorting by recent

// No _id field exposed to frontend
```

---

## AI Integration Architecture

### LLM Chat Flow

```python
1. Initialize Chat Session
   LlmChat(
     api_key=EMERGENT_LLM_KEY,
     session_id=unique_uuid,
     system_message="You are a book author..."
   )

2. Configure Model
   .with_model("openai", "gpt-4o-mini")

3. Create User Message
   UserMessage(
     text="Write a book titled 'X' with Y pages..."
   )

4. Send and Receive
   content = await chat.send_message(user_message)

5. Return Content
   └─> Structured book text with page markers
```

### AI Prompt Engineering

```
System Message:
"You are a creative book author. Write engaging, well-structured book content."

User Prompt Template:
"""
Write a complete book titled '{title}' with exactly {page_count} pages.

Each page should be approximately 200-300 words.
Format the output as:

--- Page 1 ---
[Content for page 1]

--- Page 2 ---
[Content for page 2]

...and so on.

Make it engaging, creative, and well-structured.
"""
```

---

## API Architecture

### Request/Response Cycle

```
Client Request
└─> CORS Middleware
    └─> API Router (/api prefix)
        └─> Route Handler
            ├─> Input Validation (Pydantic)
            ├─> Business Logic
            ├─> Database Operations (Motor)
            ├─> Response Formatting
            └─> Error Handling
                ├─> HTTPException (4xx, 5xx)
                └─> Logging
```

### Data Models (Pydantic)

```python
# Input Models
BookGenerate:
  - title: str
  - page_count: int (1-100)

# Database Models  
Book:
  - id: str (UUID)
  - title: str
  - content: str
  - page_count: int
  - created_at: datetime

# Response Models
BookResponse:
  - id: str
  - title: str
  - content: str
  - page_count: int
  - created_at: str (ISO format)
```

---

## Security Architecture

### CORS Configuration
```python
CORS Middleware
├─> allow_origins: configurable (default: *)
├─> allow_methods: ["*"]
├─> allow_headers: ["*"]
└─> allow_credentials: True
```

### Environment Variables
```
Backend:
├─> MONGO_URL (Connection String)
├─> DB_NAME (Database Name)
├─> CORS_ORIGINS (Comma-separated)
└─> EMERGENT_LLM_KEY (API Key)

Frontend:
└─> REACT_APP_BACKEND_URL (API Base URL)
```

### Best Practices Implemented
1. ✅ No sensitive data in source code
2. ✅ Environment-based configuration
3. ✅ Input validation (Pydantic)
4. ✅ Error handling and logging
5. ✅ UUID-based IDs (no sequential IDs)
6. ✅ MongoDB ObjectID hidden from frontend

---

## Deployment Architecture

### Development Environment
```
Local Machine
├─> MongoDB (localhost:27017)
├─> FastAPI (localhost:8001)
└─> React Dev Server (localhost:3000)
```

### Production Environment (Free Tier)
```
Internet
└─> Vercel (Frontend)
    ├─> Static React Build
    └─> CDN Distribution
        │
        └─> HTTPS API Calls
            │
            ├─> Render (Backend)
            │   ├─> FastAPI (Python)
            │   └─> Auto Sleep (15min inactivity)
            │
            └─> MongoDB Atlas
                └─> M0 Free Cluster (512MB)
```

### Docker Deployment
```
Docker Compose
├─> mongodb (Container)
│   └─> mongo:7 image
│       └─> Volume: mongo_data
│
└─> backend (Container)
    └─> Custom Dockerfile
        └─> Python 3.11 + FastAPI
```

---

## Performance Considerations

### Frontend Optimizations
- React 19 (concurrent features)
- Code splitting (React.lazy if needed)
- Tailwind CSS purging
- Axios request caching
- Loading states for async operations

### Backend Optimizations
- Async/await throughout
- Motor async MongoDB driver
- Connection pooling
- Index on `created_at` field
- Limit queries (100 books max)

### AI Generation
- Streaming not implemented (could be future enhancement)
- Average time: ~30s per page
- Model: gpt-4o-mini (fast & cost-effective)

---

## Scalability

### Current Limitations
- Single server backend (Render free tier)
- No caching layer
- No rate limiting
- No authentication
- No pagination (100 book limit)

### Future Enhancements
```
1. Add Redis for caching
2. Implement pagination
3. Add user authentication
4. Implement rate limiting
5. Add background job queue for generation
6. Implement streaming responses
7. Add CDN for book content
8. Implement search functionality
9. Add book categories/tags
10. Export books (PDF, EPUB)
```

---

## Error Handling

### Frontend
```javascript
try {
  // API call
} catch (error) {
  console.error('Error:', error)
  toast.error('User-friendly message')
}
```

### Backend
```python
try:
    # Business logic
except HTTPException:
    raise  # Re-raise HTTP exceptions
except Exception as e:
    logging.error(f"Error: {str(e)}")
    raise HTTPException(
        status_code=500,
        detail="User-friendly message"
    )
```

---

## Testing Strategy

### Manual Testing Checklist
- [ ] Health endpoint (/api/)
- [ ] Book generation (various page counts)
- [ ] Book listing
- [ ] Single book retrieval
- [ ] Book deletion
- [ ] Error handling (invalid inputs)
- [ ] CORS functionality
- [ ] UI responsiveness

### Automated Testing (Future)
```
Backend:
- pytest for API endpoints
- pytest-asyncio for async tests
- mongomock for database tests

Frontend:
- Jest for unit tests
- React Testing Library for components
- Playwright for E2E tests
```

---

## Monitoring & Logging

### Backend Logging
```python
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Production Monitoring (Recommended)
- Render: Built-in logs
- Sentry: Error tracking
- LogTail: Log aggregation
- Uptime Robot: Health monitoring

---

## Development Workflow

```
1. Local Development
   ├─> Feature branch
   ├─> Local testing
   └─> Git commit

2. Push to GitHub
   └─> Automatic triggers:
       ├─> Render: Backend deployment
       └─> Vercel: Frontend deployment

3. Automatic Deployment
   ├─> Build & deploy
   ├─> Health checks
   └─> Live in <2 minutes

4. Monitoring
   └─> Check logs & errors
```

---

For deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)