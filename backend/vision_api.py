from ultralytics import YOLO
from pathlib import Path
import cv2

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "best.pt"
model = YOLO(str(MODEL_PATH))


def detect_objects(image_path=None):

    if image_path is None:

        upload_folder = Path("uploads")
        images = list(upload_folder.glob("*"))

        if not images:
            return []

        image_path = max(images, key=lambda x: x.stat().st_mtime)

    image_path = Path(image_path)

    print(f"Processing: {image_path}")

    results = model(str(image_path))

    # ----------------------------------------
    # Save Annotated Image
    # ----------------------------------------

    output_folder = Path("static")
    output_folder.mkdir(parents=True, exist_ok=True)

    output_path = output_folder / "detected_image.jpg"

    annotated = results[0].plot()

    cv2.imwrite(str(output_path), annotated)

    # ----------------------------------------
    # AI Decision Engine
    # ----------------------------------------

    
    detections = []

    for result in results:

        for box in result.boxes:

            class_id = int(box.cls[0])
            confidence = round(float(box.conf[0]), 2)

            x1, y1, x2, y2 = box.xyxy[0]

            center_x = round(float((x1 + x2) / 2), 2)
            center_y = round(float((y1 + y2) / 2), 2)

            object_name = model.names[class_id]
            

            # ----------------------------------------
            # INDUSTRIAL QUALITY INSPECTION
            # ----------------------------------------

            defect_classes = [
                "cap missing",
                "label missing",
                "damaged plastic"
            ]

            if object_name.lower() in defect_classes:

                quality = "FAIL"
                destination = "REJECT BIN"
                robot_action = "REJECT PRODUCT"
                robot_status = "REJECT"

                reason = f"{object_name.title()} detected."

            else:

                quality = "PASS"
                destination = "GOOD BIN"
                robot_action = "PICK PRODUCT"
                robot_status = "READY FOR PICK"

                reason = "Bottle passed quality inspection."

            detections.append({

                "object": object_name,
                "confidence": confidence,
                "center_x": center_x,
                "center_y": center_y,

                "quality": quality,
                "destination": destination,
                "robot_action": robot_action,
                "robot_status": robot_status,
                "reason": reason

            })

    return detections