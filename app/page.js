"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./globals.css";

export const socket = io("https://realtime-collaboration-tool-1.onrender.com/");

export default function Home() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000"); // Default color
  const [cursorPositions, setCursorPositions] = useState({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set initial canvas properties
    context.lineWidth = 2;
    context.lineCap = "round";

    // Handle incoming drawing events
    socket.on("drawing", (data) => {
      const { x, y, type, color } = data; // Receive color from other clients
      if (type === "begin") {
        context.beginPath();
        context.moveTo(x, y);
      } else if (type === "draw") {
        context.lineTo(x, y);
        context.strokeStyle = color; // Apply the color to the stroke
        context.stroke();
      }
    });

    // Handle cursor position updates
    socket.on("cursor", (data) => {
      setCursorPositions((prev) => ({ ...prev, [data.id]: data }));
    });

    // Remove cursor when a user disconnects
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
    // console.log(nativeEvent);
    const { offsetX, offsetY } = nativeEvent;

    // Begin drawing on the local canvas
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(offsetX, offsetY);

    // Emit the drawing data to the server
    socket.emit("drawing", { x: offsetX, y: offsetY, type: "begin", color });

    setIsDrawing(true);
  };

  // Draw on mouse move
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;

    // Draw locally on the canvas
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineTo(offsetX, offsetY);
    context.strokeStyle = color; // Use the selected color
    context.stroke();

    // Emit the drawing data to the server
    socket.emit("drawing", { x: offsetX, y: offsetY, type: "draw", color });
  };

  // Stop drawing on mouse up or out
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Update cursor position and color
  const updateCursor = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    socket.emit("cursor", { x: offsetX, y: offsetY, id: socket.id, color }); // Emit cursor position and color
  };

  return (
    <div className="bg-gray-800 flex justify-center items-center w-full h-screen">
      <div className="">
        <h1
          className="text-center text-[40px] text-blue-400 heading"
          // style={{ textShadow: "2px 2px 4px #000000", color: "white" }}
        >
          Real-Time Collaboration Tool
        </h1>

        {/* Color Picker */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        {/* Drawing Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
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

        {/* Cursors for All Users */}
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
