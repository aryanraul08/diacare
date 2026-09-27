import os

# ── Fix for BatchNormalization Keras version mismatch ──
os.environ['TF_USE_LEGACY_KERAS'] = '1'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # suppresses the oneDNN warning

import tensorflow as tf
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ===============================
# LOAD MODEL
# ===============================
print("Loading foot_model.h5 ...")

model = tf.keras.models.load_model(
    "foot_model.h5",
    compile=False,
    custom_objects={
        'BatchNormalization': tf.keras.layers.BatchNormalization
    }
)

print("Model loaded successfully! ✅")

IMG_SIZE  = 224
classes   = ['callus', 'normal', 'ulcer']
THRESHOLD = 0.6


# ===============================
# PREDICTION FUNCTION
# Same logic as predict_model.py
# ===============================
def predict_image_bytes(image_bytes):
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img    = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        return "invalid", 0.0

    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE)) / 255.0
    img = np.expand_dims(img, axis=0)

    pred        = model.predict(img, verbose=0)
    class_index = np.argmax(pred)
    confidence  = float(np.max(pred))

    if confidence < THRESHOLD:
        return "invalid", confidence

    return classes[class_index], confidence


# ===============================
# ROUTES
# ===============================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status':  'Model server running ✅',
        'classes': classes,
        'model':   'foot_model.h5'
    })


@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({ 'error': 'No image received' }), 400

        image_bytes      = request.files['image'].read()
        label, confidence = predict_image_bytes(image_bytes)

        # ── Map 3 classes to app response ──
        if label == 'invalid':
            return jsonify({
                'status':     'Invalid Image',
                'label':      'invalid',
                'risk':       'Unknown',
                'confidence': round(confidence * 100, 1),
                'message':    'Please upload a clear foot image and try again.'
            })

        elif label == 'ulcer':
            return jsonify({
                'status':     'Problem Detected',
                'label':      'ulcer',
                'risk':       'High',
                'confidence': round(confidence * 100, 1),
                'message':    'Ulcer detected. Please visit a doctor immediately.'
            })

        elif label == 'callus':
            return jsonify({
                'status':     'Possible Issue',
                'label':      'callus',
                'risk':       'Medium',
                'confidence': round(confidence * 100, 1),
                'message':    'Callus detected. Monitor closely and keep foot clean and moisturized.'
            })

        else:  # normal
            return jsonify({
                'status':     'Normal',
                'label':      'normal',
                'risk':       'Low',
                'confidence': round(confidence * 100, 1),
                'message':    'No issues detected. Keep monitoring regularly.'
            })

    except Exception as e:
        print("Prediction error:", str(e))
        return jsonify({ 'error': str(e) }), 500


# ===============================
# START SERVER
# ===============================
if __name__ == '__main__':
    print("Starting server on http://10.40.6.136:5001")
    print("Test it → http://10.40.6.136:5001/health\n")
    app.run(host='0.0.0.0', port=5001, debug=True)