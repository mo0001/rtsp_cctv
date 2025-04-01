const express = require("express");
const WebSocket = require("ws");

const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "connect-src 'self' wss://rtspcctv-production.up.railway.app/");
  next();
});

wss.on("connection", (ws) => {
    console.log("New WebSocket Connection");

    ws.on("message", (message) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => console.log("Client Disconnected"));
});

server.listen(8080, () => console.log("WebRTC Signaling Server Running on Port 8080"));
