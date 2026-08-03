from ultralytics import YOLO
from pathlib import Path
import cv2

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

MODEL_PATH = PROJECT_ROOT / "models" / "best.pt"

model = YOLO(str(MODEL_PATH))


def detect_objects(image_path):

    results = model.predict(
        source=str(image_path),
        imgsz=640,
        conf=0.35,
        verbose=False
    )

    result = results[0]

    static_dir = BASE_DIR / "static"
    static_dir.mkdir(parents=True, exist_ok=True)

    output_path = static_dir / "detected_image.jpg"

    annotated = result.plot()

    cv2.imwrite(str(output_path), annotated)

    detections = []

    defect_classes = [
        "cap missing",
        "label missing",
        "damaged plastic"
    ]

    for box in result.boxes:

        class_id = int(box.cls[0])

        object_name = model.names[class_id]

        confidence = round(float(box.conf[0]), 2)

        x1, y1, x2, y2 = box.xyxy[0]

        center_x = round(float((x1 + x2) / 2), 2)
        center_y = round(float((y1 + y2) / 2), 2)

        if object_name.lower() in defect_classes:

            quality = "FAIL"
            destination = "REJECT BIN"
            robot_action = "REJECT PRODUCT"
            reason = f"{object_name.title()} detected."

        else:

            quality = "PASS"
            destination = "GOOD BIN"
            robot_action = "PICK PRODUCT"
            reason = "Bottle passed quality inspection."

        detections.append({

            "object": object_name,

            "confidence": confidence,

            "center_x": center_x,

            "center_y": center_y,

            "quality": quality,

            "destination": destination,

            "robot_action": robot_action,

            "reason": reason

        })

    return detections