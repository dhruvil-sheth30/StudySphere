# StudySphere

<p align="center">
  <img src="frontend/public/bg.png" alt="StudySphere Logo" width="200"/>
</p>

## 📚 About

StudySphere is a real-time communication platform designed specifically for collaborative learning and study groups. It enables students and educators to connect instantly, share knowledge, and engage in productive study sessions. Built with the MERN stack and WebSocket technology, StudySphere provides a seamless, responsive environment for academic collaboration.

## ✨ Features

- **Real-Time Messaging**: Instant communication with other users
- **User Authentication**: Secure login and registration system
- **User Status Tracking**: See when users are online
- **Responsive Design**: Works on desktop and mobile devices
- **Intuitive Interface**: Clean and easy-to-use UI
- **Emoji Support**: Express yourself with emojis in messages
- **Message Notifications**: Get alerted when you receive new messages

## 🛠️ Tech Stack

### Frontend
- **React**: UI building and component management
- **Tailwind CSS & DaisyUI**: Styling and UI components
- **Socket.io-client**: Real-time client-server communication
- **React Router**: Navigation and routing
- **Zustand**: State management
- **React Hot Toast**: Notification system

### Backend
- **Node.js & Express**: Server and API implementation
- **MongoDB & Mongoose**: Database and data modeling
- **Socket.io**: WebSocket implementation for real-time features
- **JWT**: Authentication and authorization
- **bcrypt.js**: Password hashing
- **Cookie-parser**: HTTP request cookie parsing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/StudySphere.git
   cd StudySphere
   ```

2. **Setup environment variables**

   Create a `.env` file in the backend directory:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

   Create a `.env` file in the frontend directory:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Run the application**

   Start the backend server:
   ```bash
   cd ../backend
   npm run dev
   ```

   Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

6. **Access the application**
   
   Open your browser and navigate to: `http://localhost:3000`

## 📝 API Documentation

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user

### Messages
- `GET /api/message/:id` - Get messages with a specific user
- `POST /api/message/send/:id` - Send a message to a specific user

### Users
- `GET /api/users` - Get all users for the sidebar

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines
- Follow the existing code style
- Write descriptive commit messages
- Comment your code where necessary
- Test your changes before submitting a PR

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- All the contributors who have helped shape StudySphere
- The amazing open-source community
- Various tutorials and resources that helped in building this application
