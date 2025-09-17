from flask import Flask, request, jsonify
import os
import sys
import json

# Add python scripts folder to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'python'))

import extract_data
import extract_face

app = Flask(__name__)

# Home route
@app.route('/')
def home():
    return "Flask backend running!"

# Endpoint to extract Aadhaar data
@app.route('/extract-data', methods=['POST'])
def extract_data_route():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = request.files['image']
    image_path = os.path.join('python', image.filename)
    image.save(image_path)

    try:
        # Call extract_data.py main function
        result = extract_data.main(image_path)
        return jsonify(result)
    finally:
        if os.path.exists(image_path):
            os.remove(image_path)

# Endpoint to crop face
@app.route('/extract-face', methods=['POST'])
def extract_face_route():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = request.files['image']
    image_path = os.path.join('python', image.filename)
    image.save(image_path)

    try:
        # Call extract_face.py function
        extract_face.extract_face(image_path)
        return jsonify({"message": "Face extraction completed"})
    finally:
        if os.path.exists(image_path):
            os.remove(image_path)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
