# DSO101 - To-Do List Web Application

This project contains a simple full-stack to-do app with:

- Frontend: React UI to add, edit, complete, and delete tasks
- Backend: Node.js + Express CRUD API
- Database: PostgreSQL for persistent storage

Project structure:

- `Backend/`
- `Frontend/`
- `render.yaml`

## 1) Environment Variables

Never commit real `.env` files to git. Use the provided examples:

- Backend template: `Backend/.env.example`
- Frontend template: `Frontend/.env.example`

Create local env files:

1. Copy `Backend/.env.example` to `Backend/.env`
2. Copy `Frontend/.env.example` to `Frontend/.env`

Backend variables:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL`
- `PORT` (default `5000`)

Frontend variable:

- `REACT_APP_API_URL` (example `http://localhost:5000`)

## 2) Local Run (Without Docker)

Prerequisites:

- Node.js 18+
- PostgreSQL running locally

Backend:

```bash
cd Backend
npm install
npm start
```

Frontend:

```bash
cd Frontend
npm install
npm start
```

Open `http://localhost:3000`.

## 3) Local Run (Docker Compose)

This starts PostgreSQL + backend + frontend together:

```bash
docker compose up --build
```

App URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api/tasks`

## 4) Docker Build and Push (Part A)

Use your student ID as image tag (example `02190108`).

Backend:

```bash
cd Backend
docker build -t yourdockerhub/be-todo:02190108 .
docker push yourdockerhub/be-todo:02190108
```

Frontend:

```bash
cd Frontend
docker build -t yourdockerhub/fe-todo:02190108 .
docker push yourdockerhub/fe-todo:02190108
```

## 5) Deploy on Render (Part A)

Backend service:

- Create Web Service from existing Docker Hub image
- Image: `yourdockerhub/be-todo:02190108`
- Set env vars:
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`
  - `DB_SSL=true`
  - `PORT=5000`

Frontend service:

- Create Web Service from existing Docker Hub image
- Image: `yourdockerhub/fe-todo:02190108`
- Set env var:
  - `REACT_APP_API_URL=https://be-todo.onrender.com`

Database:

- Use Render PostgreSQL

## 6) Automated Deploy with Blueprint (Part B)

This repo includes `render.yaml` for multi-service deployment:

- Backend Docker service (`Backend/Dockerfile`)
- Frontend Docker service (`Frontend/Dockerfile`)
- Render PostgreSQL database

On each git push, Render rebuilds and redeploys services when connected to this repository.

Useful links:

- https://render.com/docs/deploying-an-image
- https://docs.docker.com/get-started/introduction/build-and-push-first-image/
- https://render.com/docs/configure-environment-variables
- https://render.com/docs/blueprint-spec
