# 🎓 Lecture Video Progress Tracker (MERN Stack)

A full-stack web application that **tracks how much of a lecture video a user has watched**, storing only **unique watched intervals** to avoid duplication. The app can detect new users based on IP and track their video progress accurately.

---

📸 Screenshots

![App Screenshot](https://github.com/Ashishrock9394/Tutedude/blob/main/client/public/Screenshot.png)



## 🚀 Tech Stack

- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Hosting**:
  - **Frontend**: Vercel
  - **Backend**: Render

---

## 🌟 Features

- Real-time video progress tracking.
- Stores **only unique watched intervals**.
- Resume from last watched position.
- Backend stores:
  - `userId` (IP-based or assigned)
  - `videoId`
  - `intervals` (start & end timestamps)
  - `lastPosition`
  - `videoLength`

---

---

## 🔧 Environment Variables

### ✅ Client (`client/.env`)

```bash
REACT_APP_API_URL=https://tutedude-3d3x.onrender.com
NODE_OPTIONS=--openssl-legacy-provider
```

### ✅ Server (`server/.env`)

```bash
  MONGO_URI=mongodb+srv://ashishkumar9394:<password>@cluster0.amjoyah.mongodb.net/
```

## 🧪 Local Setup

Clone the repo

```bash
git clone https://github.com/Ashishrock9394/tutedude.git
cd tutedude
```

Install Backend Dependencies
```bash
cd server
npm install
```

Install Frontend Dependencies
```bash
cd ../client
npm install
```
Run Backend
```bash
cd server
node index.js
```
Run Frountend
```bash
cd client
npm start
```


## 🌐 Deployment

### 🖥 Backend on Render
Go to Render.

Create a new Web Service.

Connect your GitHub repo and point to server/ folder.

Set environment variable: MONGO_URI.

Set Start Command: node index.js.

### 🌍 Frontend on Vercel
Go to Vercel.

Import your GitHub repo and select the client/ folder.

Add env: REACT_APP_API_URL=https://your-backend-url.onrender.com.


## Author

Ashish Kumar

GitHub: @ashishkumar9394
