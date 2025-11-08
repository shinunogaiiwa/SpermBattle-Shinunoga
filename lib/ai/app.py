from flask import Flask, request, jsonify
from backend_speed_service import SpeedAnalyzer
from pathlib import Path
import tempfile

analyzer = SpeedAnalyzer(weights=Path("best.pt"), output_dir=Path("runs/speed"))

app = Flask(__name__)

@app.post("/analyze")
def analyze():
    video_file = request.files["video"]
    pixel_size = float(request.form.get("pixel_size", 1.0))
    temp_dir = Path(tempfile.gettempdir()) / "sperm_analyzer"
    temp_dir.mkdir(parents=True, exist_ok=True)
    temp_path = temp_dir / video_file.filename
    video_file.save(temp_path)
    result = analyzer.run(video_path=temp_path, pixel_size=pixel_size)
    return jsonify(result)