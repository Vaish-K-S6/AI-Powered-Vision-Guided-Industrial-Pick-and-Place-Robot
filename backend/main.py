from fastapi import FastAPI
from fastapi import UploadFile, File
import shutil
from pathlib import Path
from backend.vision_api import detect_objects
import json
from pathlib import Path

app = FastAPI()


@app.get("/")
def home():
    return {
        "project": "AI-Powered Vision Guided Industrial Pick-and-Place Robot",
        "status": "Running Successfully",
        "developer": "Vaishnavi"
    }


@app.get("/detections")
def detections():

    file_path = Path("vision/detections.json")

    if not file_path.exists():
        return {
            "message": "No detection results found."
        }

    with open(file_path, "r") as file:
        data = json.load(file)

    return data
@app.get("/live-detections")
def live_detections():

    return detect_objects()
@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):

    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)

    file_path = upload_dir / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "Image uploaded successfully!",
        "filename": file.filename,
        "saved_to": str(file_path)
    }