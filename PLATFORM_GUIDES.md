# 🚀 Platform-Specific Deployment Guides

Quick reference guides for deploying to different platforms.

---

## 1️⃣ Render (Backend) - Detailed Steps

### Prerequisites
- GitHub account
- Code pushed to GitHub repository

### Step-by-Step

1. **Sign Up**
   - Go to https://render.com
   - Click "Get Started for Free"
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" button (top right)
   - Select "Web Service"
   - Click "Connect Account" for GitHub
   - Select your repository
   - Click "Connect"

3. **Configure Service**
   ```
   Name: ai-book-generator-backend
   Runtime: Python 3
   Branch: main (or your default branch)
   Root Directory: (leave blank)
   
   Build Command:
   pip install -r backend/requirements.txt
   
   Start Command:
   cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

4. **Add Environment Variables**
   - Scroll down to "Environment Variables"
   - Click "Add Environment Variable"
   - Add each variable:

   | Key | Value |
   |-----|-------|
   | `MONGO_URL` | Your MongoDB connection string |
   | `DB_NAME` | `bookgen_db` |
   | `CORS_ORIGINS` | `*` |
   | `EMERGENT_LLM_KEY` | `sk-emergent-53481295194106fE79` |

5. **Select Plan**
   - Choose "Free" plan
   - Click "Create Web Service"

6. **Wait for Deployment**
   - Watch the logs
   - Wait for "Your service is live" message
   - Copy your service URL (e.g., `https://xxx.onrender.com`)

7. **Test Backend**
   ```bash
   curl https://your-service.onrender.com/api/
   ```
   Should return: `{"message":"AI Book Generation API"}`

### Important Notes
- ⏰ Free tier spins down after 15 minutes of inactivity
- ⚡ First request after sleep takes 30-60 seconds
- 📊 750 hours/month free (more than enough!)
- 🔄 Auto-deploys on every GitHub push

---

## 2️⃣ Vercel (Frontend) - Detailed Steps

### Prerequisites
- GitHub account
- Backend deployed and URL obtained
- Code pushed to GitHub

### Step-by-Step

1. **Sign Up**
   - Go to https://vercel.com
   - Click "Sign Up"
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Click "Import" next to your repository
   - If not shown, click "Adjust GitHub App Permissions"

3. **Configure Project**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: yarn build (or auto-detected)
   Output Directory: build (or auto-detected)
   Install Command: yarn install (or auto-detected)
   ```

4. **Add Environment Variables**
   - Expand "Environment Variables" section
   - Add variable:
   
   | Name | Value |
   |------|-------|
   | `REACT_APP_BACKEND_URL` | Your Render backend URL |
   
   Example: `https://ai-book-generator-backend.onrender.com`
   
   **Important**: No trailing slash!

5. **Deploy**
   - Click "Deploy"
   - Wait 1-3 minutes
   - Get your URL (e.g., `https://xxx.vercel.app`)

6. **Test Frontend**
   - Open your Vercel URL in browser
   - Should see the landing page
   - Check browser console for errors

### Important Notes
- ⚡ Ultra-fast deployments (<2 minutes)
- 🌍 Global CDN
- 🔄 Auto-deploys on every GitHub push
- 💰 100% free for personal projects

---

## 3️⃣ MongoDB Atlas - Detailed Steps

### Step-by-Step

1. **Sign Up**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up (free account)

2. **Create Organization** (if needed)
   - Choose organization name
   - Skip teams/projects for now

3. **Create Cluster**
   - Click "Build a Database"
   - Select "M0 FREE" option
   - Choose provider: AWS, Google Cloud, or Azure (any works)
   - Choose region (pick closest to you)
   - Cluster name: `Cluster0` (default is fine)
   - Click "Create Cluster"
   - Wait 1-3 minutes

4. **Set Up Security**
   
   **4a. Create Database User**
   - Click "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `bookgen_admin` (or your choice)
   - Password: Click "Autogenerate Secure Password" and save it!
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"
   
   **4b. Configure Network Access**
   - Click "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Confirm: `0.0.0.0/0` appears
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Python, Version: 3.12 or later
   - Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<username>` with your username
   - Replace `<password>` with your password
   - Save this connection string securely!

6. **Test Connection** (Optional but recommended)
   - Install MongoDB Compass: https://www.mongodb.com/products/compass
   - Open Compass
   - Paste your connection string
   - Click "Connect"
   - Should connect successfully

### Important Notes
- 💾 512MB storage (thousands of books)
- 🌍 Shared cluster (free tier)
- ⚡ Auto-scaling and backups
- 💰 100% free forever for M0

---

## 4️⃣ Railway (Alternative Backend Platform)

### Quick Deploy

1. **Sign Up**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   - Railway auto-detects Python
   - Set environment variables in Settings → Variables
   - Add start command in Settings:
   ```bash
   cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

4. **Deploy**
   - Click "Deploy"
   - Get your URL from the deployment

### Notes
- 💰 $5 free credit/month
- ⚡ Faster cold starts than Render
- 📊 Good for hobby projects

---

## 5️⃣ Fly.io (Alternative Backend Platform)

### Quick Deploy

1. **Install Flyctl**
   ```bash
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh
   
   # Windows
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Sign Up & Login**
   ```bash
   fly auth signup
   fly auth login
   ```

3. **Deploy**
   ```bash
   cd /path/to/your/project
   fly launch
   ```
   - Follow prompts
   - Choose region
   - Add environment variables when asked

4. **Set Environment Variables**
   ```bash
   fly secrets set MONGO_URL="your-connection-string"
   fly secrets set DB_NAME="bookgen_db"
   fly secrets set CORS_ORIGINS="*"
   fly secrets set EMERGENT_LLM_KEY="sk-emergent-53481295194106fE79"
   ```

### Notes
- 💰 3 free shared VMs
- ⚡ Fast cold starts
- 🌍 Deploy near your users

---

## 6️⃣ Netlify (Alternative Frontend Platform)

### Quick Deploy

1. **Sign Up**
   - Go to https://www.netlify.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Configure**
   ```
   Base directory: frontend
   Build command: yarn build
   Publish directory: frontend/build
   ```

4. **Environment Variables**
   - Site settings → Environment variables
   - Add `REACT_APP_BACKEND_URL`

5. **Deploy**
   - Click "Deploy site"
   - Get your URL (e.g., `https://xxx.netlify.app`)

### Notes
- 💰 100% free for personal projects
- 🌍 Global CDN
- ⚡ Form handling and serverless functions

---

## 7️⃣ Docker + VPS (Self-Hosted)

### For DigitalOcean, Linode, AWS EC2, etc.

1. **Provision Server**
   - Ubuntu 22.04 LTS recommended
   - Minimum: 1GB RAM, 1 CPU

2. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo systemctl enable docker
   sudo systemctl start docker
   ```

3. **Install Docker Compose**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd ai-book-generator
   ```

5. **Configure Environment**
   ```bash
   # Edit backend/.env with your values
   nano backend/.env
   ```

6. **Deploy**
   ```bash
   docker-compose up -d
   ```

7. **Setup Nginx (for production)**
   ```bash
   sudo apt install nginx
   ```
   
   Create `/etc/nginx/sites-available/bookgen`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
       }
       
       location /api {
           proxy_pass http://localhost:8001;
       }
   }
   ```
   
   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/bookgen /etc/nginx/sites-enabled/
   sudo systemctl reload nginx
   ```

8. **Setup SSL (with Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Notes
- 💰 Costs vary ($4-10/month typically)
- 🔧 Full control over infrastructure
- 📊 Good for learning DevOps

---

## 8️⃣ Heroku (Note: No Free Tier Anymore)

Heroku discontinued free tier in November 2022. If you have a paid account:

### Quick Deploy

1. **Install Heroku CLI**
   ```bash
   # Mac
   brew tap heroku/brew && brew install heroku
   
   # Ubuntu
   curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create your-app-name
   ```

4. **Add Buildpacks**
   ```bash
   heroku buildpacks:add heroku/python
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URL="your-connection-string"
   heroku config:set DB_NAME="bookgen_db"
   heroku config:set CORS_ORIGINS="*"
   heroku config:set EMERGENT_LLM_KEY="sk-emergent-53481295194106fE79"
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

### Notes
- 💰 Minimum $5/month (Eco dyno)
- ⚡ Fast deployments
- 📊 Good developer experience

---

## Platform Comparison

| Platform | Type | Free Tier | Best For |
|----------|------|-----------|----------|
| **Render** | Backend | ✅ 750hrs/month | Best free backend option |
| **Vercel** | Frontend | ✅ Unlimited | Best for React/Next.js |
| **Railway** | Backend | ⚠️ $5 credit/month | Alternative to Render |
| **Fly.io** | Backend | ✅ 3 VMs | Fast cold starts |
| **Netlify** | Frontend | ✅ Unlimited | Alternative to Vercel |
| **Heroku** | Backend | ❌ Paid only | Legacy option |
| **MongoDB Atlas** | Database | ✅ 512MB | Best free database |

---

## Recommended Stack (Free)

### Option 1: Maximum Reliability
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas
- **Cost**: $0/month

### Option 2: Better Performance
- **Frontend**: Vercel
- **Backend**: Fly.io
- **Database**: MongoDB Atlas
- **Cost**: $0/month

### Option 3: Self-Hosted
- **All-in-one**: Docker Compose on VPS
- **Cost**: $5-10/month (server cost)
- **Benefit**: Full control

---

## Troubleshooting by Platform

### Render Issues
- **Build fails**: Check Python version in logs
- **App crashes**: Check environment variables
- **Slow response**: Free tier cold start (normal)

### Vercel Issues
- **Build fails**: Check Node version, clear cache
- **Env vars not working**: Must start with `REACT_APP_`
- **404 errors**: Check output directory

### MongoDB Atlas Issues
- **Connection timeout**: Check network access (0.0.0.0/0)
- **Authentication failed**: Verify username/password
- **Database not found**: Check DB_NAME in connection string

---

For general deployment help, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
