# 🚀 TaskFlow — DevOps Portfolio Project

A full-stack Task Manager app built for learning real DevOps skills.

## Stack
- **Frontend**: HTML/CSS/JS served by Nginx
- **Backend**: Node.js + Express REST API
- **Containerization**: Docker + Docker Compose

---

## 📁 Project Structure

```
devops-project/
├── frontend/
│   ├── index.html       ← The web UI
│   └── Dockerfile       ← Packages the UI into an Nginx container
├── backend/
│   ├── server.js        ← Express REST API
│   ├── package.json     ← Node.js dependencies
│   └── Dockerfile       ← Packages the API into a Node container
├── docker-compose.yml   ← Runs both containers together
└── README.md
```

---

## 🐳 Stage 1: Run locally with Docker

```bash
# 1. Clone or copy this project into your Lima VM
# 2. Navigate to the project folder
cd devops-project

# 3. Build and start both containers
docker compose up --build

# 4. Open in browser
# Frontend: http://localhost:8080
# Backend API: http://localhost:3001/api/tasks
```

---

## 🌐 Stage 2: Nginx reverse proxy + SSL (coming next)

## ☁️ Stage 3: Deploy to AWS EC2 (coming next)

## ⚙️ Stage 4: GitHub Actions CI/CD (coming next)

---

## API Endpoints

| Method | Endpoint         | Description      |
|--------|-----------------|------------------|
| GET    | /api/tasks      | Get all tasks    |
| POST   | /api/tasks      | Create task      |
| PATCH  | /api/tasks/:id  | Update task      |
| DELETE | /api/tasks/:id  | Delete task      |
| GET    | /health         | Health check     |
