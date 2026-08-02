from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import shutil
import json
import uuid
from pathlib import Path

from vision_api import detect_objects

app = FastAPI()

# ---------------- CORS ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Static Files ----------------

Path("static").mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

# ---------------- Home ----------------

@app.get("/")
def home():
    return {
        "project": "AI-Powered Vision Guided Industrial Pick-and-Place Robot",
        "status": "Running Successfully",
        "developer": "Vaishnavi"
    }

# ---------------- Previous Detections ----------------

@app.get("/detections")
def detections():

    file_path = Path("vision/detections.json")

    if not file_path.exists():
        return []

    with open(file_path, "r") as file:
        return json.load(file)

# ---------------- Live Detection ----------------

@app.get("/live-detections")
def live_detections():
    return detect_objects()

# ---------------- Upload ----------------

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):

    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)

    extension = Path(file.filename).suffix

    if extension == "":
        extension = ".jpg"

    safe_filename = f"{uuid.uuid4().hex}{extension}"

    file_path = upload_dir / safe_filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    detections = detect_objects(str(file_path))

    return {
        "message": "Image uploaded successfully!",
        "filename": safe_filename,
        "detections": detections,
        "detected_image": "http://127.0.0.1:8000/static/detected_image.jpg"
    }
    
@app.post("/live-detect")
async def live_detect(file: UploadFile = File(...)):

    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)

    file_path = upload_dir / "live_frame.jpg"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    detections = detect_objects(str(file_path))

    return {
        "detections": detections,
        "detected_image": "/static/detected_image.jpg"
    }
    