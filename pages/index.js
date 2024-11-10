import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // Connect to the server

export default function homePage() {
  const [drawingData, setDrawingData] = useState(null);

  useEffect(() => {
    socket.on("drawing", (data) => {
      setDrawingData(data);
    });

    return () => {
      socket.off("drawing");
    };
  }, []);

  const handleDraw = (data) => {
    socket.emit("drawing", data);
  };

  return (
    <div>
      <h1>Real-Time Collaboration Tool</h1>
    </div>
  );
}
