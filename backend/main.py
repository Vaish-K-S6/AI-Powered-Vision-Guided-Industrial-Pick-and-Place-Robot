from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import shutil
import uuid
from pathlib import Path

from vision_api import detect_objects

app = FastAPI(title="SmartPick Backend")

# ------------------------------------------------
# CORS
# ------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------
# Folders
# ------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = BASE_DIR / "uploads"
STATIC_DIR = BASE_DIR / "static"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# ------------------------------------------------
# Home
# ------------------------------------------------

@app.get("/")
def home():
    return {
        "project": "SmartPick",
        "status": "Backend Running"
    }

# ------------------------------------------------
# Upload Image
# ------------------------------------------------

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):

    extension = Path(file.filename).suffix

    if extension == "":
        extension = ".jpg"

    filename = f"{uuid.uuid4().hex}{extension}"

    image_path = UPLOAD_DIR / filename

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    detections = detect_objects(str(image_path))

    return {
        "message": "Image uploaded successfully",
        "filename": filename,
        "detections": detections,
        "detected_image": "http://127.0.0.1:8000/static/detected_image.jpg"
    }

# ------------------------------------------------
# Live Detection
# ------------------------------------------------

@app.post("/live-detect")
async def live_detect(file: UploadFile = File(...)):

    image_path = UPLOAD_DIR / "live_frame.jpg"

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    detections = detect_objects(str(image_path))

    return {
        "detections": detections,
        "detected_image": "http://127.0.0.1:8000/static/detected_image.jpg"
    }