# 🚀 Quick Start Guide - AI Book Generator

## For Complete Beginners

This guide will help you get the app running in 3 simple steps!

---

## ✅ Prerequisites Check

Before starting, make sure you have:
- [ ] A computer with internet connection
- [ ] A code editor (VS Code recommended)
- [ ] Git installed

---

## 🎯 Choose Your Path

### Path 1: Deploy Online (Recommended - No Installation Needed!)
**Time: 15-20 minutes | Cost: FREE**

✅ Best for: Sharing with others, always accessible

👉 **[Follow the Online Deployment Guide](./DEPLOYMENT_GUIDE.md)**

Platforms you'll use:
1. MongoDB Atlas (Database) - FREE
2. Render (Backend) - FREE  
3. Vercel (Frontend) - FREE

### Path 2: Run Locally (For Development)
**Time: 10 minutes | Cost: FREE**

✅ Best for: Testing, development, learning

👉 **Continue below** ⬇️

---

## 💻 Local Development Setup

### Step 1: Install Required Software

1. **Python 3.11+**
   - Download: https://www.python.org/downloads/
   - ✅ Check installation: `python --version`

2. **Node.js 18+**
   - Download: https://nodejs.org/
   - ✅ Check installation: `node --version`

3. **Yarn**
   - Install: `npm install -g yarn`
   - ✅ Check installation: `yarn --version`

4. **MongoDB**
   - **Option A** (Easy): Use MongoDB Atlas (free online database)
     - Sign up: https://www.mongodb.com/cloud/atlas/register
     - Create free cluster
     - Get connection string
   
   - **Option B** (Local): Install MongoDB Community
     - Download: https://www.mongodb.com/try/download/community
     - Install and start service

### Step 2: Clone and Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd ai-book-generator

# 2. Setup Backend
cd backend
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=bookgen_db
CORS_ORIGINS=*
EMERGENT_LLM_KEY=sk-emergent-53481295194106fE79
EOF

# 3. Setup Frontend  
cd ../frontend
yarn install

# Create .env file
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
```

### Step 3: Run the Application

You need 3 terminal windows:

**Terminal 1 - MongoDB** (if running locally)
```bash
mongod
```

**Terminal 2 - Backend**
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 3 - Frontend**
```bash
cd frontend
yarn start
```

### Step 4: Open Your Browser

1. Go to: http://localhost:3000
2. Click "Generate New Book"
3. Enter a title and choose page count
4. Wait for AI to generate your book!
5. View it in "My Books"

---

## 🐳 Alternative: Use Docker (Easiest!)

If you have Docker installed:

```bash
# One command to run everything!
docker-compose up -d

# Access at: http://localhost:3000
```

To stop:
```bash
docker-compose down
```

---

## 🎉 Success Checklist

- [ ] Backend running at http://localhost:8001
- [ ] Frontend running at http://localhost:3000
- [ ] Can generate a test book
- [ ] Book appears in library
- [ ] Can view generated book

---

## ❓ Common Questions

**Q: Do I need an API key?**
A: No! The app comes with a demo key (`EMERGENT_LLM_KEY`). For production, you may want your own key.

**Q: Is my data saved?**
A: Yes! All books are saved in MongoDB.

**Q: Can I share my books?**
A: Yes! Deploy online (Path 1) and share the URL.

**Q: How long does generation take?**
A: About 30 seconds per page. A 10-page book takes ~5 minutes.

**Q: Is it really free?**
A: Yes! All platforms offer generous free tiers.

---

## 🆘 Need Help?

### Issue: Backend won't start
```bash
# Check if port 8001 is in use
lsof -i :8001  # Mac/Linux
netstat -ano | findstr :8001  # Windows

# Kill process using the port or use a different port
```

### Issue: Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn install
yarn start
```

### Issue: MongoDB connection failed
```bash
# If using local MongoDB, make sure it's running:
mongod --version  # Check if installed
mongod  # Start service

# Or switch to MongoDB Atlas (online)
```

### Issue: Book generation fails
- Check backend logs for errors
- Verify `EMERGENT_LLM_KEY` in backend/.env
- Try with fewer pages (e.g., 2-3 pages)

---

## 🎓 Next Steps

1. ✅ Generate your first book
2. 📖 Read the full [README.md](./README.md)
3. 🚀 Deploy online using [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
4. 🎨 Customize the UI to your liking
5. 🔧 Add new features

---

## 📚 Learning Resources

- **FastAPI**: https://fastapi.tiangolo.com/
- **React**: https://react.dev/
- **MongoDB**: https://www.mongodb.com/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

Enjoy building with AI! 🎊

Need more help? Check the [Troubleshooting section in README.md](./README.md#-troubleshooting)