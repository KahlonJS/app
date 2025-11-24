# AI Book Generator - Deployment Guide

This guide will help you deploy your AI Book Generation app to **completely free** platforms.

## 🚀 Architecture

- **Frontend**: React app (deployed on Vercel - Free)
- **Backend**: FastAPI (deployed on Render - Free)
- **Database**: MongoDB Atlas (Free Tier - 512MB)

---

## 📋 Prerequisites

Before deploying, create accounts on:
1. **MongoDB Atlas** - https://www.mongodb.com/cloud/atlas/register (Free)
2. **Render** - https://render.com/ (Free)
3. **Vercel** - https://vercel.com/signup (Free)

---

## 1️⃣ Database Setup (MongoDB Atlas)

### Step 1: Create Free Cluster
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a new **M0 (Free)** cluster
4. Choose a cloud provider and region (any will work)
5. Wait 1-3 minutes for cluster creation

### Step 2: Configure Database Access
1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Create username and password (save these!)
4. Set privileges to **Read and write to any database**

### Step 3: Configure Network Access
1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
4. Confirm

### Step 4: Get Connection String
1. Go to **Database** → Click **Connect**
2. Choose **Connect your application**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your credentials
5. **Save this connection string** - you'll need it for Render!

---

## 2️⃣ Backend Deployment (Render - Free)

### Step 1: Push Code to GitHub
1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### Step 2: Deploy on Render
1. Go to https://render.com/
2. Sign up/Login with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `ai-book-generator-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```
     pip install -r backend/requirements.txt
     ```
   - **Start Command**: 
     ```
     cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT
     ```
   - **Plan**: **Free** (750 hours/month)

### Step 3: Add Environment Variables
In the **Environment** section, add:

| Key | Value |
|-----|-------|
| `MONGO_URL` | Your MongoDB connection string from Step 1.4 |
| `DB_NAME` | `bookgen_db` |
| `CORS_ORIGINS` | `*` |
| `EMERGENT_LLM_KEY` | `sk-emergent-53481295194106fE79` |

### Step 4: Deploy
1. Click **Create Web Service**
2. Wait 2-5 minutes for deployment
3. Your backend URL will be: `https://ai-book-generator-backend.onrender.com`
4. Test it by visiting: `https://ai-book-generator-backend.onrender.com/api/`
5. You should see: `{"message":"AI Book Generation API"}`

**Important**: Free Render services spin down after 15 minutes of inactivity. First request after inactivity may take 30-60 seconds.

---

## 3️⃣ Frontend Deployment (Vercel - Free)

### Step 1: Update Frontend Environment Variable
1. Edit `frontend/.env`:
   ```
   REACT_APP_BACKEND_URL=https://ai-book-generator-backend.onrender.com
   ```
   (Replace with your actual Render backend URL)

2. Commit and push changes:
   ```bash
   git add frontend/.env
   git commit -m "Update backend URL"
   git push
   ```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com/
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`

### Step 3: Add Environment Variable
1. Go to **Settings** → **Environment Variables**
2. Add:
   - **Key**: `REACT_APP_BACKEND_URL`
   - **Value**: `https://ai-book-generator-backend.onrender.com` (your Render URL)
   - **Environment**: All environments

### Step 4: Deploy
1. Click **Deploy**
2. Wait 1-3 minutes
3. Your app will be live at: `https://your-app-name.vercel.app`

---

## 4️⃣ Alternative: Docker Deployment (Self-Hosted)

If you have your own server (VPS, home server, etc.):

### Option A: Docker Compose
```bash
# Clone your repo
git clone <your-repo>
cd ai-book-generator

# Create .env file
cat > backend/.env << EOF
MONGO_URL=mongodb://mongo:27017
DB_NAME=bookgen_db
CORS_ORIGINS=*
EMERGENT_LLM_KEY=sk-emergent-53481295194106fE79
EOF

# Create docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: .
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=bookgen_db
      - CORS_ORIGINS=*
      - EMERGENT_LLM_KEY=sk-emergent-53481295194106fE79
    depends_on:
      - mongodb

volumes:
  mongo_data:
EOF

# Run
docker-compose up -d
```

### Option B: Single Dockerfile
```bash
# Build
docker build -t ai-book-backend .

# Run
docker run -d -p 8001:8001 \
  -e MONGO_URL=<your-mongo-url> \
  -e DB_NAME=bookgen_db \
  -e CORS_ORIGINS=* \
  -e EMERGENT_LLM_KEY=sk-emergent-53481295194106fE79 \
  ai-book-backend
```

For frontend, build and serve with nginx or any static file server.

---

## 5️⃣ Alternative Free Platforms

### Railway (Backend)
- Free: $5 credit/month (enough for hobby projects)
- Steps similar to Render
- Website: https://railway.app/

### Fly.io (Backend)
- Free: 3 shared VMs
- Deploy: `flyctl launch`
- Website: https://fly.io/

### Netlify (Frontend)
- Similar to Vercel
- Unlimited bandwidth
- Website: https://www.netlify.com/

---

## 🧪 Testing Your Deployment

### 1. Test Backend
```bash
# Test health endpoint
curl https://your-backend-url.onrender.com/api/

# Test book generation
curl -X POST https://your-backend-url.onrender.com/api/books/generate \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","page_count":2}'

# Get all books
curl https://your-backend-url.onrender.com/api/books
```

### 2. Test Frontend
1. Visit your Vercel URL
2. Click "Generate New Book"
3. Enter title and page count
4. Wait for generation
5. View the generated book

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: 502 Bad Gateway on Render
- **Solution**: Check logs in Render dashboard. Usually means app crashed during startup.
- Check environment variables are set correctly

**Problem**: MongoDB connection failed
- **Solution**: 
  - Verify MONGO_URL is correct
  - Check MongoDB Atlas network access allows all IPs (0.0.0.0/0)
  - Ensure database user has correct permissions

**Problem**: First request is very slow
- **Solution**: This is normal on Render free tier (cold start after 15min inactivity)

### Frontend Issues

**Problem**: Can't connect to backend
- **Solution**: 
  - Check `REACT_APP_BACKEND_URL` is set correctly in Vercel environment variables
  - Verify backend is running (visit backend URL directly)
  - Check CORS settings in backend

**Problem**: Environment variable not working
- **Solution**: 
  - Redeploy after adding environment variables
  - Make sure variable name starts with `REACT_APP_`

### Database Issues

**Problem**: "Connection timed out"
- **Solution**: Add 0.0.0.0/0 to Network Access in MongoDB Atlas

**Problem**: "Authentication failed"
- **Solution**: Check username/password in connection string are correct

---

## 💰 Cost Breakdown (All FREE!)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **MongoDB Atlas** | ✅ Free Forever | 512MB storage, shared cluster |
| **Render** | ✅ Free Forever | 750 hours/month, 512MB RAM, spins down after 15min |
| **Vercel** | ✅ Free Forever | 100GB bandwidth, unlimited sites |

**Total Monthly Cost: $0** 🎉

---

## 📝 Important Notes

1. **Render Free Tier**: Services spin down after 15 minutes of inactivity. First request will be slow (30-60s).

2. **MongoDB Free Tier**: 512MB is enough for thousands of books.

3. **Emergent LLM Key**: The provided key is for demonstration. For production, consider:
   - Getting your own OpenAI API key
   - Setting up usage limits
   - Monitoring costs

4. **Security**: For production:
   - Update CORS_ORIGINS to your frontend domain
   - Add authentication
   - Use secrets management

---

## 🎉 You're Done!

Your AI Book Generator is now deployed and accessible worldwide for FREE!

**Share your app**: Just share your Vercel URL with anyone!

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render/Vercel deployment logs
3. Verify all environment variables are set correctly
4. Test backend API endpoints directly with curl

---

## 🔄 Updating Your Deployment

When you make code changes:

### Backend (Render)
1. Push changes to GitHub
2. Render auto-deploys on every push
3. Or manually click "Deploy latest commit"

### Frontend (Vercel)
1. Push changes to GitHub
2. Vercel auto-deploys on every push
3. Or manually click "Redeploy"

---

## 📦 What's Included

This deployment includes:
- ✅ AI-powered book generation
- ✅ Customizable page count (1-50 pages)
- ✅ Book library with save/delete
- ✅ Beautiful responsive UI
- ✅ Full MongoDB persistence
- ✅ RESTful API
- ✅ CORS configured
- ✅ Error handling

---

Enjoy your deployed AI Book Generator! 🎊📚✨
