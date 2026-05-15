# MERN Thinkboard

## Overview

This project includes a MongoDB-backed notes API for a MERN stack. The backend connects to MongoDB via Mongoose and exposes REST endpoints under `/api/notes`.

## Prerequisites

- Node.js 18+ and npm
- Docker Desktop for Windows (recommended for local MongoDB): https://www.docker.com/products/docker-desktop/

## Backend setup (first time)

Install backend dependencies:

```powershell
cd backend
npm install
```

Create an environment file from the example:

```powershell
Copy-Item .env.example .env
```

Update `MONGO_URI` in `.env` if you use a different database connection string.

## Database setup (Docker, recommended)

The repo includes a `docker-compose.yml` that runs MongoDB and Mongo Express for easy local inspection.

Step 1: Start the database services:

```powershell
docker compose up -d
```

Step 2: Check that both containers are running:

```powershell
docker compose ps
```

Step 3: Use the default local connection string in `.env`:

```
mongodb://localhost:27017/thinkboard-db
```

Step 4 (optional): Open Mongo Express in your browser:

- http://localhost:8081

To stop the containers:

```powershell
docker compose down
```

### Alternative: MongoDB Atlas (cloud)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas and create a database user.
2. Whitelist your IP (or allow access from anywhere for quick testing).
3. Copy the connection string provided by Atlas and set it as `MONGO_URI` in `.env`.

Example:

```
mongodb+srv://<username>:<password>@cluster0.abcd1.mongodb.net/thinkboard-db?retryWrites=true&w=majority
```

## Run the backend

```powershell
cd backend
npm run dev
```

Health check:

- http://localhost:5001/api/health

## View links

- API health: http://localhost:5001/api/health
- Mongo Express UI: http://localhost:8081

## API endpoints

- `GET /api/notes`
- `GET /api/notes/:id`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`

## Troubleshooting

If port `5001` is already in use, run these commands from PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 5001 | Select-Object -ExpandProperty OwningProcess
Stop-Process -Id 12244 -Force
npm run dev
```

Replace `12244` with the process ID returned by the first command.
