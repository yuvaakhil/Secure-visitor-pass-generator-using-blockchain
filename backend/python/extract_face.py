import cv2
import uuid
import os
import sys
import json

def extract_face(image_path, output_dir='python/cropped_faces'):
    os.makedirs(output_dir, exist_ok=True)

    image = cv2.imread(image_path)
    if image is None:
        print(json.dumps({"error": "Could not read image"}))
        return

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    if len(faces) == 0:
        print(json.dumps({"error": "No face detected"}))
        return

    (x, y, w, h) = faces[0]
    cropped = image[y:y+h, x:x+w]
    filename = f"{output_dir}/face_{uuid.uuid4().hex}.jpg"
    cv2.imwrite(filename, cropped)

    print(json.dumps({ "path": filename }))
    return

if __name__ == "__main__":
    extract_face(sys.argv[1])
