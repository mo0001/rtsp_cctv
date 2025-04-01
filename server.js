const express = require("express");
const WebSocket = require("ws");
const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files if needed
app.use(express.static('public'));

// Keep track of connected clients
let connectedClients = [];

wss.on("connection", (ws) => {
  console.log("New WebSocket Connection");
  connectedClients.push(ws);
  
  // Handle messages from clients
  ws.on("message", (message) => {
    console.log(`Received message of size: ${message.length} bytes`);
    
    // Forward message to all other connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  
  // Handle disconnection
  ws.on("close", () => {
    console.log("Client Disconnected");
    // Remove client from the list
    const index = connectedClients.indexOf(ws);
    if (index > -1) {
      connectedClients.splice(index, 1);
    }
    console.log(`Remaining connections: ${connectedClients.length}`);
  });
  
  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket Error:", error);
  });
});

server.listen(8080, () => console.log("WebSocket Server Running on Port 8080"));