from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf   # or torch if your model is PyTorch
import cv2
import base64

app = Flask(__name__)
CORS(app)  # allows your Expo app to call this server

# ── Load your CNN model once at startup ──
model = tf.keras.models.load_model('your_model.h5')  # change path to your model file

# ── Image preprocessing — match exactly what you did during training ──
def preprocess_image(image_bytes):
    # Decode the image from bytes
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Resize to whatever size your model was trained on (e.g. 224x224)
    img = cv2.resize(img, (224, 224))

    # Normalize pixel values (0-1)
    img = img / 255.0

    # Add batch dimension → shape becomes (1, 224, 224, 3)
    img = np.expand_dims(img, axis=0)

    return img

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image file from the request
        if 'image' not in request.files:
            return jsonify({ 'error': 'No image received' }), 400

        file = request.files['image']
        image_bytes = file.read()

        # Preprocess
        img = preprocess_image(image_bytes)

        # Run through your CNN model
        prediction = model.predict(img)

        # ── Interpret result — adjust based on your model's output ──
        # Example: binary classification (ulcer / no ulcer)
        confidence = float(prediction[0][0])

        if confidence > 0.7:
            result = { 'status': 'Problem Detected', 'risk': 'High',   'confidence': round(confidence * 100, 1) }
        elif confidence > 0.4:
            result = { 'status': 'Possible Issue',   'risk': 'Medium', 'confidence': round(confidence * 100, 1) }
        else:
            result = { 'status': 'Normal',           'risk': 'Low',    'confidence': round((1 - confidence) * 100, 1) }

        return jsonify(result)

    except Exception as e:
        return jsonify({ 'error': str(e) }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({ 'status': 'Model server running' })

if __name__ == '__main__':
    # 0.0.0.0 means any device on your network can reach it
    app.run(host='0.0.0.0', port=5001, debug=True)