# Real-Time Chat Application

A full-stack, real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. The application supports direct messaging, group channels, real-time communication, file sharing, and user profile management.

## Features

- **User Authentication:** Secure signup and login using JSON Web Tokens (JWT) and cookies.
- **Real-Time Communication:** Instant messaging powered by Socket.IO.
- **Direct Messages:** 1-on-1 private conversations.
- **Channels:** Group chat functionality.
- **File Sharing:** Upload and share images and files using Multer.
- **Profile Management:** Customize user profiles including avatars, display names, and profile colors.
- **Responsive UI:** Modern, accessible, and responsive user interface built with Tailwind CSS and Radix UI components.
- **State Management:** Efficient client-side state management using Zustand.

## Tech Stack

### Frontend (Client)
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS, Tailwind Animate
- **Components:** Shadcn UI
- **State Management:** Zustand
- **Routing:** React Router DOM
- **Real-Time:** Socket.io-client
- **HTTP Client:** Axios
- **Icons:** Lucide React, React Icons

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Real-Time:** Socket.IO
- **Authentication:** JWT, bcrypt
- **File Uploads:** Multer
- **Middlewares:** CORS, cookie-parser

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anhquan-ngg/Real-Time-Chat-Application.git
   cd Real-Time-Chat-Application
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add the necessary environment variables:
   ```env
   PORT=3001
   DATABASE_URL=your_mongodb_connection_string
   ORIGIN=http://localhost:5173
   JWT_KEY=your_jwt_secret_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   Open a new terminal window and navigate to the client directory:
   ```bash
   cd client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_SERVER_URL=http://localhost:3001
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`.

## Folder Structure

- `client/`: Contains the React frontend code.
- `server/`: Contains the Node.js/Express backend code, including routes, controllers, models, and socket logic.
  - `server/uploads/`: Directory where uploaded files and profile pictures are stored.
  - `server/models/`: MongoDB models (User, Message, Channel).
  - `server/socket.js`: Socket.IO implementation for real-time events.

## License

This project is licensed under the ISC License.
