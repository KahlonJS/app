# 📚 AI Book Generator

An intelligent book generation application powered by AI that creates complete books with customizable page counts.

![AI Book Generator](https://img.shields.io/badge/AI-Powered-purple)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## ✨ Features

- 🤖 **AI-Powered Generation**: Creates engaging book content using advanced AI
- 📖 **Customizable Page Count**: Choose from 1-50 pages
- 💾 **Save & Manage**: All books saved in your personal library
- 🎨 **Beautiful UI**: Modern, responsive design with gradient themes
- 📱 **Fully Responsive**: Works on desktop, tablet, and mobile
- ⚡ **Fast & Efficient**: Optimized for quick generation and loading

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database for book storage
- **Motor** - Async MongoDB driver
- **Emergent LLM Integration** - AI text generation

### Frontend
- **React 19** - Latest React with hooks
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (local or Atlas)
- Yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-book-generator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create .env file
   echo "MONGO_URL=mongodb://localhost:27017" > .env
   echo "DB_NAME=bookgen_db" >> .env
   echo "CORS_ORIGINS=*" >> .env
   echo "EMERGENT_LLM_KEY=sk-emergent-53481295194106fE79" >> .env
   
   # Run backend
   uvicorn server:app --host 0.0.0.0 --port 8001
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   yarn install
   
   # Create .env file
   echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
   
   # Run frontend
   yarn start
   ```

4. **Access the app**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001/api/

## 📦 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions to **FREE** platforms:
- ✅ **Backend**: Render (Free tier)
- ✅ **Frontend**: Vercel (Free tier)
- ✅ **Database**: MongoDB Atlas (Free tier)

**Total Cost: $0/month** 🎉

### Quick Deploy Options

#### Option 1: Docker Compose (Recommended for Self-Hosting)
```bash
docker-compose up -d
```

#### Option 2: Individual Docker Container
```bash
docker build -t ai-book-backend .
docker run -d -p 8001:8001 \
  -e MONGO_URL=<your-mongo-url> \
  -e DB_NAME=bookgen_db \
  -e CORS_ORIGINS=* \
  -e EMERGENT_LLM_KEY=sk-emergent-53481295194106fE79 \
  ai-book-backend
```

## 🎯 API Endpoints

### Books
- `GET /api/` - Health check
- `POST /api/books/generate` - Generate a new book
- `GET /api/books` - Get all books
- `GET /api/books/{book_id}` - Get specific book
- `DELETE /api/books/{book_id}` - Delete a book

### Example Request
```bash
curl -X POST http://localhost:8001/api/books/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Adventures of AI",
    "page_count": 10
  }'
```

## 📂 Project Structure

```
ai-book-generator/
├── backend/
│   ├── server.py           # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styles
│   │   ├── index.js       # Entry point
│   │   └── components/    # UI components
│   ├── package.json       # Node dependencies
│   └── .env              # Frontend environment
├── Dockerfile             # Backend Docker config
├── docker-compose.yml     # Multi-container setup
├── render.yaml           # Render deployment config
├── vercel.json           # Vercel deployment config
├── railway.json          # Railway deployment config
├── DEPLOYMENT_GUIDE.md   # Detailed deployment guide
└── README.md             # This file
```

## 🔧 Configuration

### Backend Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `bookgen_db` |
| `CORS_ORIGINS` | Allowed CORS origins | `*` |
| `EMERGENT_LLM_KEY` | AI API key | Required |

### Frontend Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Backend API URL | `http://localhost:8001` |

## 🧪 Testing

### Backend Testing
```bash
# Test health endpoint
curl http://localhost:8001/api/

# Test book generation
curl -X POST http://localhost:8001/api/books/generate \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","page_count":2}'
```

### Frontend Testing
1. Navigate to http://localhost:3000
2. Click "Generate New Book"
3. Enter title and select page count
4. Wait for generation
5. View in library

## 🎨 Features in Detail

### Book Generation
- Select page count from 1-50 using an intuitive slider
- Enter custom book title
- Real-time generation progress
- AI creates coherent, page-structured content

### Book Library
- View all generated books
- Beautiful card-based layout
- Quick preview of book content
- Delete unwanted books
- Sorted by creation date

### Book Viewer
- Clean, readable book display
- Page-by-page content view
- Easy navigation back to library
- Metadata display (pages, date)

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Check MongoDB is running
- Verify environment variables in `.env`
- Check port 8001 is available

**Frontend can't connect to backend**
- Verify `REACT_APP_BACKEND_URL` is correct
- Check backend is running
- Check CORS configuration

**Book generation fails**
- Verify `EMERGENT_LLM_KEY` is set correctly
- Check backend logs for errors
- Ensure MongoDB connection is working

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Developer Notes

### Adding New Features
1. Backend: Add routes in `server.py`
2. Frontend: Add components in `src/components/`
3. Update API endpoints in frontend

### Database Schema
```python
Book {
    id: str (UUID)
    title: str
    content: str
    page_count: int
    created_at: datetime
}
```

## 🌟 Acknowledgments

- Built with FastAPI, React, and MongoDB
- AI powered by Emergent LLM Integration
- UI components from Shadcn/ui
- Icons from Lucide React

---

Made with ❤️ and AI

For deployment help, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
