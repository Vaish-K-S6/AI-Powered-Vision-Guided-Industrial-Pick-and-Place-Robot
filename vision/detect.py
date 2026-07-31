from ultralytics import YOLO
import json

print("Loading YOLOv8 model...")

model = YOLO("yolov8n.pt")

print("Model loaded successfully!")

results = model("images/test.png", save=True)

print("\nDetected Objects:\n")

for result in results:
    boxes = result.boxes

    for box in boxes:
        class_id = int(box.cls[0])
        class_name = model.names[class_id]
        confidence = float(box.conf[0])

        x1, y1, x2, y2 = box.xyxy[0]

        center_x = (x1 + x2) / 2
        center_y = (y1 + y2) / 2

        print(f"Object      : {class_name}")
        print(f"Confidence  : {confidence:.2f}")
        print(f"Center      : ({center_x:.2f}, {center_y:.2f})")
        print(f"BoundingBox : ({x1:.2f}, {y1:.2f}) -> ({x2:.2f}, {y2:.2f})")
        print("-" * 50)
        

detections = []

for result in results:
    boxes = result.boxes

    for box in boxes:
        class_id = int(box.cls[0])

        detections.append({
            "object": model.names[class_id],
            "confidence": float(box.conf[0]),
            "center_x": float((box.xyxy[0][0] + box.xyxy[0][2]) / 2),
            "center_y": float((box.xyxy[0][1] + box.xyxy[0][3]) / 2)
        })

with open("vision/detections.json", "w") as f:
    json.dump(detections, f, indent=4)

print("\nDetection results saved to vision/detections.json")