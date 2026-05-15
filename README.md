# MERN Thinkboard

Thinkboard is a full-stack notes app built with MongoDB, Express, React, Vite, Tailwind CSS, DaisyUI, TanStack Query, and Docker.

## What You Need

Install these first:

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) if you want the easiest setup
- Git

The app uses these local ports:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:5001` |
| API health check | `http://localhost:5001/api/health` |
| MongoDB | `mongodb://localhost:27017/thinkboard-db` |
| Mongo Express | `http://localhost:8081` |

## Fastest Start: Docker

From the project root:

```powershell
docker compose up --build
```

Open:

```text
http://localhost:5173
```

Docker starts MongoDB, Mongo Express, the Express backend, and the Vite frontend preview server. The containers wait for MongoDB and the backend health check before starting dependent services.

Stop everything:

```powershell
docker compose down
```

Remove the MongoDB data volume and start fresh:

```powershell
docker compose down -v
docker compose up --build
```

## Local Development Without Docker

Use this when you want hot reload for backend and frontend development.

### 1. Start MongoDB

Option A, with Docker:

```powershell
docker compose up mongo mongo-express
```

Option B, with a MongoDB installation on your machine:

```powershell
mongod
```

### 2. Configure Backend

```powershell
cd backend
copy .env.example .env
npm install
npm run dev
```

Backend `.env`:

```env
MONGO_URI=mongodb://localhost:27017/thinkboard-db
PORT=5001
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
MONGO_CONNECT_ATTEMPTS=10
```

The backend should show:

```text
MongoDB connected
Server is running on port 5001
```

### 3. Configure Frontend

Open a second terminal:

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5001
```

Open:

```text
http://localhost:5173
```

## Useful Commands

Run frontend checks:

```powershell
cd frontend
npm run lint
npm run build
```

Seed MongoDB with example notes:

```powershell
cd backend
npm run seed
```

Start backend normally:

```powershell
cd backend
npm start
```

Start frontend production preview:

```powershell
cd frontend
npm run build
npm run preview -- --host 0.0.0.0 --port 5173
```

## API Routes

Base URL:

```text
http://localhost:5001/api/notes
```

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/notes` | Get all notes |
| `GET` | `/api/notes/:id` | Get one note |
| `POST` | `/api/notes` | Create a note |
| `PUT` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |
| `GET` | `/api/health` | Backend and database health |

Create or update payload:

```json
{
  "title": "My note",
  "content": "Details go here"
}
```

## Project Structure

```text
MERN-Thinkboard/
  backend/
    src/
      config/db.js
      controllers/notesController.js
      models/Note.js
      routes/notesRoutes.js
      server.js
  frontend/
    src/
      api/notesApi.js
      components/
      pages/
      App.jsx
      main.jsx
  docker-compose.yml
```

## Troubleshooting

If PowerShell blocks `npm`, use `npm.cmd` instead:

```powershell
npm.cmd install
npm.cmd run dev
```

If port `5001` is already in use:

```powershell
Get-NetTCPConnection -LocalPort 5001 | Select-Object -ExpandProperty OwningProcess
Stop-Process -Id YOUR_PROCESS_ID -Force
```

If port `5173` is already in use:

```powershell
Get-NetTCPConnection -LocalPort 5173 | Select-Object -ExpandProperty OwningProcess
Stop-Process -Id YOUR_PROCESS_ID -Force
```

If Docker containers behave strangely after dependency or database changes:

```powershell
docker compose down -v
docker compose up --build
```

If the frontend says requests are failing:

- Make sure the backend is running on `http://localhost:5001`.
- Visit `http://localhost:5001/api/health`.
- Make sure `frontend/.env` has `VITE_API_URL=http://localhost:5001`.
- Make sure `backend/.env` allows the frontend origin in `CORS_ORIGIN`.

## Notes

- Frontend styling uses Tailwind CSS and DaisyUI in `frontend/tailwind.config.js`.
- Server state is managed with TanStack Query.
- Docker uses named volume `mongo-data` so notes persist across restarts.
- Mongo Express is only for local development.
