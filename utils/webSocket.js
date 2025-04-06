const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

// Broadcasting function for real-time updates
const broadcast = (message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

// Attach WebSocket server to the main HTTP server
const attachWebSocketServer = (server) => {
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
};

// Broadcast balance change
const broadcastBalanceChange = (userId, newBalance) => {
    const message = JSON.stringify({ userId, newBalance });
    broadcast(message);
};

// Broadcast transaction details
const broadcastTransaction = (userId, transactionDetails) => {
    const message = JSON.stringify({ userId, transactionDetails });
    broadcast(message);
};

module.exports = { attachWebSocketServer, broadcastBalanceChange, broadcastTransaction };
