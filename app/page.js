"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./globals.css";

// ✅ Ensure this uses the correct backend URL
const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
  transports: ["websocket"], // Avoid long polling issues
});

export default function Home() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [cursorPositions, setCursorPositions] = useState({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineWidth = 2;
    context.lineCap = "round";

    // Log the server URL being used
    console.log(
      "Socket Server URL:",
      process.env.NEXT_PUBLIC_SOCKET_SERVER_URL
    );

    socket.on("drawing", ({ x, y, type, color }) => {
      if (type === "begin") {
        context.beginPath();
        context.moveTo(x, y);
      } else if (type === "draw") {
        context.lineTo(x, y);
        context.strokeStyle = color;
        context.stroke();
      }
    });

    socket.on("cursor", (data) => {
      setCursorPositions((prev) => ({ ...prev, [data.id]: data }));
    });

    socket.on("removeCursor", (id) => {
      setCursorPositions((prev) => {
        const newPositions = { ...prev };
        delete newPositions[id];
        return newPositions;
      });
    });

    return () => {
      socket.off("drawing");
      socket.off("cursor");
      socket.off("removeCursor");
    };
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext("2d");
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    socket.emit("drawing", { x: offsetX, y: offsetY, type: "begin", color });
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext("2d");
    context.lineTo(offsetX, offsetY);
    context.strokeStyle = color;
    context.stroke();
    socket.emit("drawing", { x: offsetX, y: offsetY, type: "draw", color });
  };

  const stopDrawing = () => setIsDrawing(false);

  const updateCursor = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    socket.emit("cursor", { x: offsetX, y: offsetY, id: socket.id, color });
  };

  return (
    <div className="bg-gray-800 flex justify-center items-center w-full h-screen relative">
      <div>
        <h1 className="text-center text-[40px] text-blue-400 heading">
          Real-Time Collaboration Tool
        </h1>

        {/* Color Picker */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={(e) => {
            draw(e);
            updateCursor(e);
          }}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          style={{
            border: "1px solid white",
            cursor: "crosshair",
            background: "white",
          }}
        />

        {/* Cursors */}
        {Object.keys(cursorPositions).map((id) => (
          <div
            key={id}
            style={{
              position: "absolute",
              left: cursorPositions[id].x + "px",
              top: cursorPositions[id].y + "px",
              width: "10px",
              height: "10px",
              backgroundColor: cursorPositions[id].color || "blue",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
