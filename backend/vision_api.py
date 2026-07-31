from ultralytics import YOLO
from pathlib import Path

model = YOLO("yolov8n.pt")


def detect_objects():

    upload_folder = Path("uploads")

    images = list(upload_folder.glob("*"))

    if not images:
        return [{"message": "No uploaded image found."}]

    latest_image = max(images, key=lambda x: x.stat().st_mtime)

    results = model(
    str(latest_image),
    save=True,
    project="runs",
    name="latest_detection",
    exist_ok=True
)
    detections = []

    for result in results:
        for box in result.boxes:

            class_id = int(box.cls[0])

            x1, y1, x2, y2 = box.xyxy[0]

            detections.append({
                "object": model.names[class_id],
                "confidence": round(float(box.conf[0]), 2),
                "center_x": round(float((x1 + x2) / 2), 2),
                "center_y": round(float((y1 + y2) / 2), 2)
            })

    return detections