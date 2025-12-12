# 🌱 AgriSense - Smart Weather & Farming Advisory

**AgriSense** is a modern, full-stack web application designed to empower farmers with real-time weather data and actionable. It features a premium, responsive UI and generates downloadable PDF reports for offline use.

---

## 🚀 Features

*   **Real-Time Weather**: Accurate temperature, humidity, wind, and pressure data via OpenWeatherMap API.
*   **Smart Advisories**: Rule-based logic provides tailored farming advice (e.g., irrigation tips, pest warnings, frost alerts) based on current weather conditions.
*   **Interactive Dashboard**:
    *   **Visual Charts**: 24-hour temperature trend visualization.
    *   **Premium UI**: Glass-morphism design with smooth animations.
    *   **Responsive**: Fully optimized for desktop, tablet, and mobile devices (includes auto-scroll to advisories on mobile).
*   **PDF Reports**: One-click download of weather summaries and advisories for offline reference.
*   **Search History**: Tracks recent city searches for quick access.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, Recharts, Phosphor Icons, jsPDF.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose) - Stores user search history.
*   **External APIs**: OpenWeatherMap API.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [MongoDB](https://www.mongodb.com/try/download/community) (running locally) OR a MongoDB Atlas connection string.
*   An [OpenWeatherMap API Key](https://openweathermap.org/api).

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/AgriSense.git
cd AgriSense
```

### 2. Backend Setup (`/server`)
Navigate to the server directory, install dependencies, and configure environment variables.

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/agrisense
OPENWEATHER_API_KEY=your_actual_api_key_here
```
*(Replace `your_actual_api_key_here` with your OpenWeatherMap API key)*

### 3. Frontend Setup (`/client`)
Open a new terminal, navigate to the client directory, and install dependencies.

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5001
```

---

## ▶️ Running the Application

You need to run both the backend and frontend servers simultaneously.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5001
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)** to use the app.

---

## 📂 Project Structure

```
AgriSense/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main views (Dashboard)
│   │   ├── services/       # API integration logic
│   └── ...
├── server/                 # Express Backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   └── index.js            # Server entry point
└── README.md
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

<img width="1440" height="809" alt="Screenshot 2025-12-12 at 11 07 20 PM" src="https://github.com/user-attachments/assets/2cb61b49-ac13-4062-9969-0f71c81bd9d1" />
<br><br>
<img width="1440" height="813" alt="Screenshot 2025-12-12 at 11 05 55 PM" src="https://github.com/user-attachments/assets/3fbb51e4-18ca-47cf-a6f4-2b8617bd6792" />
<br><br>
<img width="1440" height="635" alt="Screenshot 2025-12-12 at 11 05 06 PM" src="https://github.com/user-attachments/assets/f61d76a9-5ed5-4af5-90e0-635fd529a9ce" />
