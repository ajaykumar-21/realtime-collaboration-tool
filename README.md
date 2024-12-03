## Real-Time Collaboration Tool 
This project is a Real-Time Collaboration Tool that allows multiple users to draw collaboratively on a shared canvas in real-time. It leverages Next.js for the frontend, Socket.IO for real-time communication, and supports deployment on platforms like Vercel (frontend) and Render (backend).

### Features
- Real-Time Drawing
    Users can draw collaboratively, and changes are reflected in real-time for all participants.

- Customizable Colors
    Users can select their preferred color for drawing using a color picker.

- Cursor Tracking
    Displays real-time cursor positions of connected users on the canvas.

## Tech Stack
### Frontend
- Next.js (React framework)
- Tailwind CSS (Responsive UI design)
- Socket.IO-Client (Real-time communication)

### Backend

- Node.js with Express.js
- Socket.IO (WebSocket server for real-time events)
- Deployed on Render

## Setup and Installation
### Prerequisites

- Node.js installed on your machine
- npm or yarn

## Steps to Run Locally
###  Clone the Repository
- git clone https://github.com/ajaykumar-21/realtime-collaboration-tool.git
- cd realtime-collaboration-tool

###  Install Frontend Dependencies
- cd frontend
- npm install

### Start the Backend Server
- cd backend
- npm start

### Start the Frontend Server
- npm run dev

## Usage

- Open the deployed frontend URL in multiple browsers or devices.
- Start drawing on the canvas.
- Changes will reflect in real-time for all connected users.
- Use the color picker to change the drawing color.