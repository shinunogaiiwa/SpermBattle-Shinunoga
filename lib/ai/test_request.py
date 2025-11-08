import requests

url = "http://127.0.0.1:8000/analyze"
with open("C:/Code/GoOnHacks/visem-tracking/sample_video/11.mp4", "rb") as f:
    files = {"video": ("your_video.mp4", f, "video/mp4")}
    data = {"pixel_size": "1.0"}
    resp = requests.post(url, files=files, data=data)
print(f"status: {resp.status_code}")
try:
    print("json:", resp.json())
except ValueError:
    print("raw:", resp.text)