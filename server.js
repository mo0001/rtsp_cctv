const express = require("express");
const WebSocket = require("ws");

const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket Connection");

  // Handle messages from ESP32 and forward to clients
  wss.on("message", (message) => {
    ws.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  wss.on("close", () => console.log("Client Disconnected"));
});

server.listen(8080, () => console.log("WebSocket Server Running on Port 8080"));

