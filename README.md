# DiaCare

**Your diabetes companion.**

DiaCare is a comprehensive diabetes management mobile application built by **Team Red Falcon**. It helps diabetic patients monitor and manage blood sugar levels, medicine reminders, diet tracking, and foot health — all from a single app.

---

## Features

- **Blood Sugar Tracker** — Log and monitor blood sugar readings with automatic status classification (Normal / High / Low)
- **Medicine Reminders** — Add medicines with dosage and time, toggle taken status and reminders
- **Diet Checker** — Log food with glycemic index (GI) values and calories, auto-categorized as Safe / Moderate / Avoid
- **AI Foot Scan** — Capture or upload a foot image and get instant risk classification (Normal / Callus / Ulcer) using a TensorFlow CNN model
- **Nearby Hospitals** — Find hospitals and clinics within 5 km using OpenStreetMap, with emergency SOS (108) and quick-dial buttons (Police: 100, Fire: 101)
- **Firebase Authentication** — Secure email/password login and registration

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React Native + Expo SDK 54 |
| Backend API | Node.js + Express 5 + MongoDB (Mongoose) |
| AI Model Server | Python + Flask + TensorFlow/Keras |
| Authentication | Firebase Auth (email/password) |
| Database | MongoDB Atlas |
| Location Services | OpenStreetMap Overpass API (free) |

---

## Project Structure

```
diacare/
├── ai/                         # AI model server
│   ├── model_server.py         # Flask server for foot classification
│   └── foot_model.h5           # Pre-trained Keras CNN model
├── backend/                    # REST API server
│   ├── server.js               # Express entry point
│   ├── package.json
│   ├── models/                 # Mongoose data models
│   │   ├── SugarLog.js
│   │   ├── Medicine.js
│   │   └── DietLog.js
│   └── routes/                 # API route handlers
│       ├── sugar.js
│       ├── medicine.js
│       └── diet.js
├── frontend/                   # React Native mobile app
│   ├── App.js                  # Root component with navigation
│   ├── index.js                # Expo entry point
│   ├── firebase.js             # Firebase configuration
│   ├── config.js               # API URL and keys
│   ├── theme.js                # Color theme
│   ├── context/
│   │   └── AuthContext.js      # Auth context provider
│   ├── screens/                # App screens
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── FootScanScreen.js
│   │   ├── SugarTrackerScreen.js
│   │   ├── MedicineReminderScreen.js
│   │   ├── DietCheckerScreen.js
│   │   ├── NearbyHospitalsScreen.js
│   │   ├── TrackScreen.js
│   │   └── ProfileScreen.js
│   └── components/             # Reusable UI components
│       ├── StatCard.js
│       ├── ScreenHeader.js
│       ├── PrimaryButton.js
│       └── MedicineCard.js
└── .gitignore
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18+)
- **npm** or **yarn**
- **Python 3.8+** (for AI server)
- **MongoDB** instance (local or MongoDB Atlas)
- **Firebase** project with Authentication enabled
- **Expo Go** app (for testing on mobile)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>
PORT=5000
```

Start the server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

---

### 2. AI Model Server Setup

```bash
cd ai
pip install flask flask-cors tensorflow numpy opencv-python
python model_server.py
```

The model server will be available at `http://0.0.0.0:5001`.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file (see `.env.example`):

```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

Update `frontend/config.js` with your backend API IP address, then start:

```bash
npx expo start
```

Scan the QR code with the Expo Go app, or run on a specific platform:

```bash
npx expo start --android
npx expo start --ios
npx expo start --web
```

---

## API Endpoints

### Sugar Tracking (`/sugar`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sugar` | Log a blood sugar reading |
| GET | `/sugar` | Get all readings (newest first) |
| DELETE | `/sugar/:id` | Delete a reading |

### Medicine Reminders (`/medicine`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/medicine` | Add a new medicine |
| GET | `/medicine` | Get all medicines |
| PATCH | `/medicine/:id/taken` | Toggle taken status |
| PATCH | `/medicine/:id/reminder` | Toggle reminder |
| DELETE | `/medicine/:id` | Remove a medicine |

### Diet Checker (`/diet`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/diet` | Log a food entry |
| GET | `/diet` | Get all diet logs |
| GET | `/diet/today` | Get today's logs |
| DELETE | `/diet/:id` | Remove a food entry |

### AI Model Server (port 5001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/predict` | Classify foot image (multipart form, field: `image`) |

---

## Classification Logic

**Blood Sugar Levels:**
- **High:** > 140 mg/dL
- **Normal:** 70–140 mg/dL
- **Low:** < 70 mg/dL

**Glycemic Index Categories:**
- **Avoid:** GI > 70
- **Moderate:** GI 55–70
- **Safe:** GI < 55

**Foot Scan Results:**
- **Normal** — Low risk, no issues detected
- **Callus** — Medium risk, recommended to monitor and keep foot clean
- **Ulcer** — High risk, visit doctor immediately

---

## Environment Variables

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 5000) | No |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_GEMINI_API_KEY` | Google Gemini API key | No (unused currently) |

---

## License

This project does not currently include a license.

---

Built with care by **Team Red Falcon**.
