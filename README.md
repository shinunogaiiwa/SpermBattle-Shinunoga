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

- `POST /api/analysis/upload` – run YOLO-based video analysis and register the score
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

## How uploads turn into scores

1. **Video ingestion** – `/api/analysis/upload` saves the uploaded video to a temp file and runs `lib/ai/backend_speed_service.SpeedAnalyzer`. The YOLO tracker writes rich JSON under `lib/ai/runs/speed/` (tracks, pixel/physical speeds, fps, etc.) and returns the same payload to the backend.
2. **Score synthesis** – `backend/app/mock_data.register_ai_analysis` reads the analyzer payload:
   - Uses `summary.pixel_speed_stats/physical_speed_stats` for overall speed averages, medians, and maxima.
   - Counts per-track means above 5 px/s to infer “active” sperm, which drives normal/cluster/pinhead counts and coverage.
   - Blends speed, burst, and coverage components into `quality_score`, with quantity/morphology/motility derived from track counts and sample density.
   - Assigns titles/categories and lightweight “gaming” stats (wins/losses) so new entries behave like the seeded leaderboard rows.
3. **Frontend visuals** – Every place that renders an analysis (leaderboard cards, upload confirmation, battle intros, and the “4D Score Analysis” radar) reads the same `Analysis` object, so what you see on the report page is exactly what the analyzer produced.

Because everything is in-memory, restarting the FastAPI server wipes analyses/battles. Re-upload to regenerate fresh scores.
