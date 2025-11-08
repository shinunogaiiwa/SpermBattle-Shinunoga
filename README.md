# SpermBattle

Gamified sperm analysis playground built with a Next.js 14 frontend and a FastAPI backend.  
The repo is now split into two top-level folders:

```
backend/   # FastAPI service (uploads, leaderboard, battles)
frontend/  # Next.js app (neon UI)
```

## Prerequisites

- Node.js 18+
- Python 3.11+

## Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API routes:

- `POST /api/analysis/upload` – mock analysis generation for uploaded files
- `GET /api/analysis/{id}` – fetch a single analysis
- `GET /api/leaderboard?category=global|shame|gaming`
- `POST /api/battle` and `GET /api/battle/{id}` – create/fetch battles

## Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local   # only if you need to override defaults
```

Ensure the `.env.local` points to the FastAPI server:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the dev server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app. Uploads, leaderboards, and battles now call the FastAPI backend.

## Development Tips

- Start both servers (frontend + backend) in separate terminals.
- Restart the FastAPI server whenever you touch Python files; data resets because it lives in-memory.
- Lint the frontend from `frontend/` with `npm run lint`.
